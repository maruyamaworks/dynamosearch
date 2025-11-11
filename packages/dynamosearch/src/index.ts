import { createHash } from 'node:crypto';
import {
  DynamoDBClient,
  BatchWriteItemCommand,
  CreateTableCommand,
  DeleteTableCommand,
  GetItemCommand,
  QueryCommand,
  ResourceInUseException,
  ResourceNotFoundException,
  UpdateItemCommand,
  type AttributeValue,
  type CreateTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import type Analyzer from './analyzers/Analyzer.js';

const BATCH_SIZE = 25;

export interface Attribute {
  name: string;
  analyzer: Analyzer;
  shortName?: string;
  boost?: number;
}

export interface Key {
  name: string;
  type: 'HASH' | 'RANGE';
}

export interface Options {
  indexTableName: string;
  attributes: Attribute[];
  keys: Key[];
}

export interface SearchOptions {
  attributes?: string[];
  maxItems?: number;
  minScore?: number;
  bm25?: BM25Params;
}

export interface BM25Params {
  k1?: number;
  b?: number;
}

const encodeKeys = (keys: Record<string, any>[], { delimiter = ';', escape = '\\' } = {}) => {
  let str = '';
  for (let i = 0; i < keys.length; i++) {
    str += Object.keys(keys[i])[0];
    str += Object.values(keys[i])[0].replaceAll(escape, `${escape}${escape}`).replaceAll(delimiter, `${escape}${delimiter}`);
    if (i < keys.length - 1) str += delimiter;
  }
  return str;
};

const decodeKeys = (str: string, { delimiter = ';', escape = '\\' } = {}) => {
  const keys: string[] = [];
  let i = 0, current = '';
  while (i < str.length) {
    const char = str[i];
    if (char === escape && i < str.length - 1) {
      current += str[i + 1];
      i += 2;
    } else if (char === delimiter) {
      keys.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  keys.push(current);

  return keys.map(key => ({ [key.slice(0, 1)]: key.slice(1) }));
};

const encodeBinaryAttribute = (value: AttributeValue): any => {
  if (value.B && typeof value.B !== 'string') {
    return { B: Buffer.from(value.B).toString('base64') };
  }
  return value;
};

class DynamoSearch {
  client: DynamoDBClient;
  indexTableName: string;
  attributes: Attribute[];
  partitionKeyName: string;
  sortKeyName?: string;

  static INDEX_KEYS = 'keys-index';
  static INDEX_HASH = 'hash-index';

  static ATTR_PK = 'p';
  static ATTR_SK = 's';
  static ATTR_KEYS = 'k';
  static ATTR_HASH = 'h';

  static ATTR_META_DOCUMENT_COUNT = 'dc';
  static ATTR_META_TOKEN_COUNT = 'tc';

  static META_KEY = {
    [DynamoSearch.ATTR_PK]: { S: '_' },
    [DynamoSearch.ATTR_SK]: { B: new Uint8Array([0]) },
  };

  constructor(options: Options) {
    this.client = new DynamoDBClient({
      endpoint: process.env.NODE_ENV === 'test' ? 'http://localhost:8000' : undefined,
    });
    this.indexTableName = options.indexTableName;
    this.attributes = options.attributes;
    this.partitionKeyName = options.keys.find(key => key.type === 'HASH')!.name;
    this.sortKeyName = options.keys.find(key => key.type === 'RANGE')?.name;
  }

  async createIndexTable({ ifNotExists, tableProperties }: { ifNotExists?: boolean; tableProperties?: Partial<CreateTableCommandInput> } = {}) {
    try {
      await this.client.send(new CreateTableCommand({
        TableName: this.indexTableName,
        AttributeDefinitions: [
          { AttributeName: DynamoSearch.ATTR_PK, AttributeType: 'S' },
          { AttributeName: DynamoSearch.ATTR_SK, AttributeType: 'B' },
          { AttributeName: DynamoSearch.ATTR_KEYS, AttributeType: 'S' },
          { AttributeName: DynamoSearch.ATTR_HASH, AttributeType: 'B' },
        ],
        KeySchema: [
          { AttributeName: DynamoSearch.ATTR_PK, KeyType: 'HASH' },
          { AttributeName: DynamoSearch.ATTR_SK, KeyType: 'RANGE' },
        ],
        GlobalSecondaryIndexes: [{
          IndexName: DynamoSearch.INDEX_KEYS,
          KeySchema: [{ AttributeName: DynamoSearch.ATTR_KEYS, KeyType: 'HASH' }],
          Projection: { ProjectionType: 'KEYS_ONLY' },
        }],
        LocalSecondaryIndexes: [{
          IndexName: DynamoSearch.INDEX_HASH,
          KeySchema: [
            { AttributeName: DynamoSearch.ATTR_PK, KeyType: 'HASH' },
            { AttributeName: DynamoSearch.ATTR_HASH, KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'KEYS_ONLY' },
        }],
        BillingMode: 'PAY_PER_REQUEST',
        ...tableProperties,
      }));
    } catch (error) {
      if (!(ifNotExists && error instanceof ResourceInUseException)) {
        throw error;
      }
    }
  }

  async deleteIndexTable({ ifExists }: { ifExists?: boolean } = {}) {
    try {
      await this.client.send(new DeleteTableCommand({
        TableName: this.indexTableName,
      }));
    } catch (error) {
      if (!(ifExists && error instanceof ResourceNotFoundException)) {
        throw error;
      }
    }
  }

  async insertTokens(record: DynamoDBRecord, resultMap = new Map<string, number>()) {
    for (let i = 0; i < this.attributes.length; i++) {
      const tokens = new Map<string, number>();
      const result = this.attributes[i].analyzer.analyze(record.dynamodb!.NewImage![this.attributes[i].name].S ?? '');
      resultMap.set(this.attributes[i].name, (resultMap.get(this.attributes[i].name) ?? 0) + result.length);
      for (let j = 0; j < result.length; j++) {
        tokens.set(result[j].text, (tokens.get(result[j].text) ?? 0) + 1);
      }
      const entries = [...tokens.entries()];
      for (let j = 0; j < entries.length; j += BATCH_SIZE) {
        await this.client.send(new BatchWriteItemCommand({
          RequestItems: {
            [this.indexTableName]: entries.slice(j, j + BATCH_SIZE).map(([token, occurrence]) => {
              const encodedKeys = encodeKeys([
                record.dynamodb!.Keys![this.partitionKeyName],
                ...(this.sortKeyName ? [record.dynamodb!.Keys![this.sortKeyName]] : []),
              ]);
              const hash = createHash('md5').update(encodedKeys).digest();
              const buffer = Buffer.allocUnsafe(14);
              buffer.writeUInt16BE(Math.min(2 ** 16 - 1, occurrence), 0);
              buffer.writeUInt32BE(Math.min(2 ** 32 - 1, result.length), 2);
              hash.copy(buffer, 6, 0, 8);
              const item = {
                [DynamoSearch.ATTR_PK]: { S: `${this.attributes[i].shortName || this.attributes[i].name};${token}` },
                [DynamoSearch.ATTR_SK]: { B: buffer },
                [DynamoSearch.ATTR_KEYS]: { S: encodedKeys },
                [DynamoSearch.ATTR_HASH]: { B: hash.subarray(0, 1) },
              };
              return { PutRequest: { Item: item } };
            }),
          },
        }));
      }
    }

    return resultMap;
  }

  async deleteTokens(record: DynamoDBRecord, resultMap = new Map<string, number>()) {
    const items: Record<string, AttributeValue>[] = [];
    let exclusiveStartKey: Record<string, AttributeValue> | undefined = undefined;
    do {
      const encodedKeys = encodeKeys([
        record.dynamodb!.Keys![this.partitionKeyName],
        ...(this.sortKeyName ? [record.dynamodb!.Keys![this.sortKeyName]] : []),
      ]);
      const { Items, LastEvaluatedKey }: { Items?: Record<string, AttributeValue>[]; LastEvaluatedKey?: Record<string, AttributeValue> } = await this.client.send(new QueryCommand({
        TableName: this.indexTableName,
        IndexName: DynamoSearch.INDEX_KEYS,
        KeyConditionExpression: '#keys = :keys',
        ProjectionExpression: '#pk, #sk',
        ExpressionAttributeNames: {
          '#pk': DynamoSearch.ATTR_PK,
          '#sk': DynamoSearch.ATTR_SK,
          '#keys': DynamoSearch.ATTR_KEYS,
        },
        ExpressionAttributeValues: {
          ':keys': { S: encodedKeys },
        },
        ExclusiveStartKey: exclusiveStartKey,
      }));
      if (Items) items.push(...Items);
      exclusiveStartKey = LastEvaluatedKey;
    } while (exclusiveStartKey);

    for (let i = 0; i < items.length; i++) {
      const [shortName]: (string | undefined)[] = items[i][DynamoSearch.ATTR_PK].S!.split(';');
      const attributeName = this.attributes.find(attr => attr.shortName === shortName)?.name ?? shortName;
      const occurrence = Buffer.from(items[i][DynamoSearch.ATTR_SK].B!).readUInt16BE(0);
      resultMap.set(attributeName, (resultMap.get(attributeName) ?? 0) - occurrence);
    }
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      await this.client.send(new BatchWriteItemCommand({
        RequestItems: {
          [this.indexTableName]: items.slice(i, i + BATCH_SIZE).map((item) => ({
            DeleteRequest: { Key: item },
          })),
        },
      }));
    }

    return resultMap;
  }

  async getMetadata() {
    const { Item } = await this.client.send(new GetItemCommand({
      TableName: this.indexTableName,
      Key: DynamoSearch.META_KEY,
    }));

    return {
      docCount: parseInt(Item?.[DynamoSearch.ATTR_META_DOCUMENT_COUNT].N ?? '0'),
      tokenCount: new Map(Object.entries(Item ?? {}).filter(([key]) => key.startsWith(`${DynamoSearch.ATTR_META_TOKEN_COUNT}:`)).map(([key, value]) => {
        const shortName = key.replace(`${DynamoSearch.ATTR_META_TOKEN_COUNT}:`, '');
        const attributeName = this.attributes.find(attr => attr.shortName === shortName)?.name ?? shortName;
        return [attributeName, parseInt(value.N ?? '0')];
      })),
    };
  }

  async updateMetadata({ count, resultMap }: { count: number; resultMap: Map<string, number> }) {
    let updateExpressions = ['#attr = if_not_exists(#attr, :zero) + :val'];
    const expressionAttributeNames: Record<string, string> = {
      '#attr': DynamoSearch.ATTR_META_DOCUMENT_COUNT,
    };
    const expressionAttributeValues: Record<string, AttributeValue> = {
      ':zero': { N: '0' },
      ':val': { N: count.toString() },
    };
    const entries = [...resultMap.entries()];
    entries.forEach(([attributeName, value], index) => {
      const shortName = this.attributes.find(attr => attr.name === attributeName)?.shortName ?? attributeName;
      updateExpressions.push(`#attr${index} = if_not_exists(#attr${index}, :zero) + :val${index}`);
      expressionAttributeNames[`#attr${index}`] = `${DynamoSearch.ATTR_META_TOKEN_COUNT}:${shortName}`;
      expressionAttributeValues[`:val${index}`] = { N: value.toString() };
    });
    await this.client.send(new UpdateItemCommand({
      TableName: this.indexTableName,
      Key: DynamoSearch.META_KEY,
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }));
  }

  async processRecords(records: DynamoDBRecord[]) {
    let count = 0;
    const resultMap = new Map<string, number>();
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      switch (record.eventName) {
        case 'INSERT':
          await this.insertTokens(record, resultMap);
          count++;
          break;
        case 'MODIFY':
          await this.deleteTokens(record, resultMap);
          await this.insertTokens(record, resultMap);
          break;
        case 'REMOVE':
          await this.deleteTokens(record, resultMap);
          count--;
          break;
        default:
          throw new Error(`Unknown eventName: ${record.eventName}`);
      }
    }
    await this.updateMetadata({ count, resultMap });
  }

  async reindex(items: Record<string, AttributeValue>[]) {
    await this.processRecords(items.map((item) => ({
      eventName: 'MODIFY',
      dynamodb: {
        Keys: {
          [this.partitionKeyName]: encodeBinaryAttribute(item[this.partitionKeyName]),
          ...(this.sortKeyName ? { [this.sortKeyName]: encodeBinaryAttribute(item[this.sortKeyName]) } : {}),
        },
        NewImage: Object.fromEntries(Object.entries(item).map(([key, value]) => [key, encodeBinaryAttribute(value)])),
      },
    })));
  }

  async search(query: string, { attributes, maxItems = 100, minScore = 0, bm25: { k1 = 1.2, b = 0.75 } = {} }: SearchOptions = {}) {
    const _attributes = attributes?.map((attributeName) => {
      const attribute = this.attributes.find(attr => attr.name === attributeName.split('^')[0]);
      const boost = parseFloat(attributeName.split('^')[1] || '1');
      if (!attribute) {
        throw new Error(`Attribute not found: ${attributeName}`);
      }
      return { ...attribute, boost };
    }) ?? this.attributes;

    let consumedCapacity = 0;
    const { docCount, tokenCount: tokenCountMap } = await this.getMetadata();
    const candidates = new Map<string, number>();
    for (let i = 0; i < _attributes.length; i++) {
      const tokens = _attributes[i].analyzer.analyze(query);
      const words = [...new Set(tokens.map(token => token.text))];
      for (let j = 0; j < words.length; j++) {
        const command = new QueryCommand({
          TableName: this.indexTableName,
          KeyConditionExpression: '#pk = :pk',
          ProjectionExpression: '#sk, #keys',
          ExpressionAttributeNames: {
            '#pk': DynamoSearch.ATTR_PK,
            '#sk': DynamoSearch.ATTR_SK,
            '#keys': DynamoSearch.ATTR_KEYS,
          },
          ExpressionAttributeValues: {
            ':pk': { S: `${_attributes[i].shortName || _attributes[i].name};${words[j]}` },
          },
          ReturnConsumedCapacity: 'TOTAL',
          ScanIndexForward: false,
        });
        const { Items, ConsumedCapacity } = await this.client.send(command);
        consumedCapacity += ConsumedCapacity?.CapacityUnits ?? 0;
        if (Items) {
          const idf = Math.log(1 + (docCount - Items.length + 0.5) / (Items.length + 0.5));
          Items.forEach((item) => {
            const occurrence = Buffer.from(item[DynamoSearch.ATTR_SK].B!).readUInt16BE(0);
            const tokenCount = Buffer.from(item[DynamoSearch.ATTR_SK].B!).readUInt32BE(2);
            const encodedKeys = item[DynamoSearch.ATTR_KEYS].S!;
            const averageTokenCount = tokenCountMap.get(_attributes[i].name)! / docCount;
            const tf = occurrence / (occurrence + k1 * (1 - b + b * (tokenCount / averageTokenCount)));
            const score = (_attributes[i].boost ?? 1) * tf * idf * (k1 + 1);
            candidates.set(encodedKeys, (candidates.get(encodedKeys) ?? 0) + score);
          });
        }
      }
    }

    return {
      items: [...candidates.entries()]
        .filter(([, score]) => score >= minScore)
        .sort(([, score_A], [, score_B]) => score_B - score_A)
        .slice(0, maxItems)
        .map(([key, score]) => ({
          keys: {
            [this.partitionKeyName]: decodeKeys(key)[0],
            ...(this.sortKeyName ? { [this.sortKeyName]: decodeKeys(key)[1] } : {}),
          },
          score,
        })),
      consumedCapacity: {
        capacityUnits: consumedCapacity,
        tableName: this.indexTableName,
      },
    };
  }
}

export default DynamoSearch;
