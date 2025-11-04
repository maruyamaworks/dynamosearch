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
} from '@aws-sdk/client-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import type Analyzer from './analyzers/Analyzer.js';

const BATCH_SIZE = 25;
const KEYS_INDEX_NAME = 'keys-index';
const HASH_INDEX_NAME = 'hash-index';

export interface Attribute {
  name: string;
  analyzer: Analyzer;
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

class DynamoSearch {
  client: DynamoDBClient;
  indexTableName: string;
  attributes: Attribute[];
  partitionKeyName: string;
  sortKeyName?: string;

  constructor(options: Options) {
    this.client = new DynamoDBClient({
      endpoint: process.env.NODE_ENV === 'test' ? 'http://localhost:8000' : undefined,
    });
    this.indexTableName = options.indexTableName;
    this.attributes = options.attributes;
    this.partitionKeyName = options.keys.find(key => key.type === 'HASH')!.name;
    this.sortKeyName = options.keys.find(key => key.type === 'RANGE')?.name;
  }

  async createIndexTable({ ifNotExists }: { ifNotExists?: boolean } = {}) {
    try {
      await this.client.send(new CreateTableCommand({
        TableName: this.indexTableName,
        AttributeDefinitions: [
          { AttributeName: 'token', AttributeType: 'S' },
          { AttributeName: 'tfkeys', AttributeType: 'S' },
          { AttributeName: 'keys', AttributeType: 'S' },
          { AttributeName: 'hash', AttributeType: 'B' },
        ],
        KeySchema: [
          { AttributeName: 'token', KeyType: 'HASH' },
          { AttributeName: 'tfkeys', KeyType: 'RANGE' },
        ],
        GlobalSecondaryIndexes: [{
          IndexName: KEYS_INDEX_NAME,
          KeySchema: [{ AttributeName: 'keys', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'KEYS_ONLY' },
        }],
        LocalSecondaryIndexes: [{
          IndexName: HASH_INDEX_NAME,
          KeySchema: [
            { AttributeName: 'token', KeyType: 'HASH' },
            { AttributeName: 'hash', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'KEYS_ONLY' },
        }],
        BillingMode: 'PAY_PER_REQUEST',
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
      resultMap.set(this.attributes[i].name, result.length);
      for (let i = 0; i < result.length; i++) {
        tokens.set(result[i].text, (tokens.get(result[i].text) ?? 0) + 1);
      }
      const entries = [...tokens.entries()];
      for (let i = 0; i < entries.length; i += BATCH_SIZE) {
        await this.client.send(new BatchWriteItemCommand({
          RequestItems: {
            [this.indexTableName]: entries.slice(i, i + BATCH_SIZE).map((entry) => {
              const occurrence = Math.min(entry[1], 0xffff).toString(16).padStart(4, '0');
              const tokenCount = Math.min(result.length, 0xffffffff).toString(16).padStart(8, '0');
              const keys = [
                record.dynamodb!.Keys![this.partitionKeyName],
                ...(this.sortKeyName ? [record.dynamodb!.Keys![this.sortKeyName]] : []),
              ];
              const item = {
                token: { S: `${this.attributes[i].name}/${entry[0]}` },
                tfkeys: { S: JSON.stringify([occurrence, tokenCount, ...keys]) },
                keys: { S: JSON.stringify(keys) },
                hash: { B: createHash('md5').update(JSON.stringify(keys)).digest() },
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
      const { Items, LastEvaluatedKey }: { Items?: Record<string, AttributeValue>[]; LastEvaluatedKey?: Record<string, AttributeValue> } = await this.client.send(new QueryCommand({
        TableName: this.indexTableName,
        IndexName: KEYS_INDEX_NAME,
        KeyConditionExpression: '#keys = :keys',
        ExpressionAttributeNames: {
          '#keys': 'keys',
        },
        ExpressionAttributeValues: {
          ':keys': {
            S: JSON.stringify([
              record.dynamodb!.Keys![this.partitionKeyName],
              ...(this.sortKeyName ? [record.dynamodb!.Keys![this.sortKeyName]] : []),
            ]),
          },
        },
        ExclusiveStartKey: exclusiveStartKey,
      }));
      if (Items) items.push(...Items);
      exclusiveStartKey = LastEvaluatedKey;
    } while (exclusiveStartKey);

    for (let i = 0; i < items.length; i++) {
      const [attributeName] = items[i].token.S!.split('/');
      const [occurrenceHex] = JSON.parse(items[i].tfkeys.S!);
      const occurrence = parseInt(occurrenceHex, 16);
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
      Key: {
        token: { S: '#metadata' },
        tfkeys: { S: '[]' },
      },
    }));

    return {
      docCount: parseInt(Item?.doc_count.N ?? '0'),
      tokenCount: new Map(Object.entries(Item ?? {}).filter(([key]) => key.startsWith('token_count:')).map(([key, value]) => {
        return [key.replace(/^token_count:/, ''), parseInt(value.N ?? '0')];
      })),
    };
  }

  async updateMetadata({ count, resultMap }: { count: number; resultMap: Map<string, number> }) {
    let updateExpressions = ['doc_count = if_not_exists(doc_count, :zero) + :value'];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, AttributeValue> = {
      ':zero': { N: '0' },
      ':value': { N: count.toString() },
    };
    const entries = [...resultMap.entries()];
    entries.forEach(([attributeName, value], index) => {
      updateExpressions.push(`#attr${index} = if_not_exists(#attr${index}, :zero) + :val${index}`);
      expressionAttributeNames[`#attr${index}`] = `token_count:${attributeName}`;
      expressionAttributeValues[`:val${index}`] = { N: value.toString() };
    });
    await this.client.send(new UpdateItemCommand({
      TableName: this.indexTableName,
      Key: {
        token: { S: '#metadata' },
        tfkeys: { S: '[]' },
      },
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

  async search(query: string, options: { attributes?: string[]; bm25params?: { k1?: number; b?: number } } = {}) {
    const attributes = options.attributes?.map((attributeName) => {
      const attribute = this.attributes.find(({ name }) => name === attributeName.split('^')[0]);
      const boost = parseFloat(attributeName.split('^')[1] || '1');
      if (!attribute) {
        throw new Error(`Attribute not found: ${attributeName}`);
      }
      return { ...attribute, boost };
    }) ?? this.attributes;

    const k1 = options.bm25params?.k1 ?? 1.2;
    const b = options.bm25params?.b ?? 0.75;

    let consumedCapacity = 0;
    const { docCount, tokenCount } = await this.getMetadata();
    const candidates = new Map<string, number>();
    for (let i = 0; i < attributes.length; i++) {
      const tokens = attributes[i].analyzer.analyze(query);
      const words = [...new Set(tokens.map(token => token.text))];
      for (let j = 0; j < words.length; j++) {
        const command = new QueryCommand({
          TableName: this.indexTableName,
          KeyConditionExpression: '#token = :token',
          ProjectionExpression: '#token, tfkeys',
          ExpressionAttributeNames: {
            '#token': 'token',
          },
          ExpressionAttributeValues: {
            ':token': { S: `${attributes[i].name}/${words[j]}` },
          },
          ReturnConsumedCapacity: 'TOTAL',
        });
        const { Items, ConsumedCapacity } = await this.client.send(command);
        consumedCapacity += ConsumedCapacity?.CapacityUnits ?? 0;
        if (Items) {
          const idf = Math.log(1 + (docCount - Items.length + 0.5) / (Items.length + 0.5));
          Items.forEach((item) => {
            const [occurrenceHex, fieldLenHex, ...keys] = JSON.parse(item.tfkeys.S!);
            const occurrence = parseInt(occurrenceHex, 16);
            const fieldLen = parseInt(fieldLenHex, 16);
            const avgFieldLen = tokenCount.get(attributes[i].name)! / docCount;
            const tf = occurrence / (occurrence + k1 * (1 - b + b * (fieldLen / avgFieldLen)));
            const score = (attributes[i].boost ?? 1) * tf * idf * (k1 + 1);
            candidates.set(JSON.stringify(keys), (candidates.get(JSON.stringify(keys)) ?? 0) + score);
          });
        }
      }
    }

    return {
      items: [...candidates.entries()].map(([key, score]) => ({
        keys: {
          [this.partitionKeyName]: JSON.parse(key)[0] as AttributeValue,
          ...(this.sortKeyName ? { [this.sortKeyName]: JSON.parse(key)[1] as AttributeValue } : {}),
        },
        score,
      })),
      consumedCapacity,
    };
  }
}

export default DynamoSearch;
