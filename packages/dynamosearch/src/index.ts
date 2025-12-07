import { createHash } from 'node:crypto';
import { appendFile } from 'node:fs/promises';
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
  type DynamoDBClientConfig,
} from '@aws-sdk/client-dynamodb';
import { parse } from './query_parser/parser.js';
import type { DynamoDBRecord } from 'aws-lambda';
import type Analyzer from './analyzers/Analyzer.js';

const BATCH_SIZE = 25;

export interface Attribute {
  name: string;
  analyzer: Analyzer;
  shortName?: string;
  mapper?: (value: AWSLambda.AttributeValue) => string[];
}

export interface Key {
  name: string;
  type: 'HASH' | 'RANGE';
}

export interface Options {
  indexTableName: string;
  attributes: Attribute[];
  keys: Key[];
  dynamoDBClientConfig?: DynamoDBClientConfig;
  bm25Params?: Partial<BM25Params>;
}

export interface BM25Params {
  k1: number;
  b: number;
}

export interface IndexMetadata {
  docCount: number;
  tokenCount: Map<string, number>;
}

export type Query =
  | { match: MatchQuery }
  | { matchPhrase: MatchPhraseQuery }
  | { multiMatch: MultiMatchQuery }
  | { simpleQueryString: SimpleQueryStringQuery }
  | { bool: BooleanQuery };

export interface BooleanQuery {
  must?: Query[];
  filter?: Query[];
  should?: Query[];
  mustNot?: Query[];
  minimumShouldMatch?: number;
}

export interface MatchQuery {
  [attributeName: string]: string | {
    query: string;
    boost?: number;
    operator?: 'OR' | 'AND';
    minimumShouldMatch?: number;
  };
}

export interface MatchPhraseQuery {
  [attributeName: string]: string | {
    query: string;
    boost?: number;
    slop?: number;
  };
}

export type MultiMatchQuery =
  | {
      query: string;
      type?: 'best_fields' | 'most_fields';
      fields?: string[];
      operator?: 'OR' | 'AND';
      minimumShouldMatch?: number;
    }
  | {
      query: string;
      type: 'phrase';
      fields?: string[];
      slop?: number;
    };

export interface SimpleQueryStringQuery {
  query: string;
  fields?: string[];
  defaultOperator?: 'OR' | 'AND';
}

export interface SearchOptions {
  attributes?: string[];
  operator?: 'OR' | 'AND';
  minimumShouldMatch?: number;
  maxItems?: number;
  minScore?: number;
}

const encodeKeys = (keys: AWSLambda.AttributeValue[], { delimiter = ';', escape = '\\' } = {}) => {
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

const extractStringValues = (value?: AWSLambda.AttributeValue): string[] => {
  if (value?.S) {
    return [value.S];
  }
  if (value?.SS) {
    return value.SS;
  }
  if (value?.L) {
    return value.L.flatMap(extractStringValues);
  }
  return [];
};

class DynamoSearch {
  private client: DynamoDBClient;
  private indexTableName: string;
  private attributes: Attribute[];
  private partitionKeyName: string;
  private sortKeyName?: string;
  private bm25: BM25Params;

  static readonly INDEX_KEYS = 'keys-index';
  static readonly INDEX_HASH = 'hash-index';

  static readonly ATTR_PK = 'p';
  static readonly ATTR_SK = 's';
  static readonly ATTR_KEYS = 'k';
  static readonly ATTR_HASH = 'h';
  static readonly ATTR_POSITION = 'z';

  static readonly ATTR_META_DOCUMENT_COUNT = 'dc';
  static readonly ATTR_META_TOKEN_COUNT = 'tc';

  static readonly META_KEY = {
    [DynamoSearch.ATTR_PK]: { S: '_' },
    [DynamoSearch.ATTR_SK]: { B: Buffer.alloc(1) },
  };

  constructor(options: Options) {
    this.client = new DynamoDBClient({ ...options.dynamoDBClientConfig });
    this.indexTableName = options.indexTableName;
    this.attributes = options.attributes;
    this.partitionKeyName = options.keys.find(key => key.type === 'HASH')!.name;
    this.sortKeyName = options.keys.find(key => key.type === 'RANGE')?.name;
    this.bm25 = { k1: 1.2, b: 0.75, ...options.bm25Params };
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
        GlobalSecondaryIndexes: [
          {
            IndexName: DynamoSearch.INDEX_KEYS,
            KeySchema: [
              { AttributeName: DynamoSearch.ATTR_KEYS, KeyType: 'HASH' },
            ],
            Projection: { ProjectionType: 'KEYS_ONLY' },
          },
          {
            IndexName: DynamoSearch.INDEX_HASH,
            KeySchema: [
              { AttributeName: DynamoSearch.ATTR_PK, KeyType: 'HASH' },
              { AttributeName: DynamoSearch.ATTR_HASH, KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'KEYS_ONLY' },
          },
        ],
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

  private getEncodedKeys(item: Record<string, AWSLambda.AttributeValue>) {
    return encodeKeys([
      item[this.partitionKeyName],
      ...(this.sortKeyName ? [item[this.sortKeyName]] : []),
    ]);
  }

  private getDecodedKeys(str: string) {
    return {
      [this.partitionKeyName]: decodeKeys(str)[0],
      ...(this.sortKeyName ? { [this.sortKeyName]: decodeKeys(str)[1] } : {}),
    };
  }

  async insertTokens(item: Record<string, AWSLambda.AttributeValue>, resultMap = new Map<string, number>()) {
    let inserted = 0;
    for (let i = 0; i < this.attributes.length; i++) {
      const tokens = new Map<string, number[]>();
      const attributeValues = (this.attributes[i].mapper ?? extractStringValues)(item[this.attributes[i].name]);
      const result = (await Promise.all(attributeValues.map(str => this.attributes[i].analyzer.analyze(str)))).flat();
      resultMap.set(this.attributes[i].name, (resultMap.get(this.attributes[i].name) ?? 0) + result.length);
      for (let j = 0; j < result.length; j++) {
        if (tokens.has(result[j].token)) {
          tokens.get(result[j].token)!.push(result[j].position);
        } else {
          tokens.set(result[j].token, [result[j].position]);
        }
      }
      const entries = [...tokens.entries()];
      for (let j = 0; j < entries.length; j += BATCH_SIZE) {
        await this.client.send(new BatchWriteItemCommand({
          RequestItems: {
            [this.indexTableName]: entries.slice(j, j + BATCH_SIZE).map(([token, positions]) => {
              const encodedKeys = this.getEncodedKeys(item);
              const hash = createHash('md5').update(encodedKeys).digest();
              const buffer = Buffer.allocUnsafe(14);
              buffer.writeUInt16BE(Math.min(2 ** 16 - 1, positions.length), 0);
              buffer.writeUInt32BE(Math.min(2 ** 32 - 1, result.length), 2);
              hash.copy(buffer, 6, 0, 8);
              const data = {
                [DynamoSearch.ATTR_PK]: { S: `${this.attributes[i].shortName || this.attributes[i].name};${token}` },
                [DynamoSearch.ATTR_SK]: { B: buffer },
                [DynamoSearch.ATTR_KEYS]: { S: encodedKeys },
                [DynamoSearch.ATTR_HASH]: { B: hash.subarray(0, 1) },
                [DynamoSearch.ATTR_POSITION]: { L: positions.map(pos => ({ N: pos.toString() })) },
              };
              return { PutRequest: { Item: data } };
            }),
          },
        }));
      }
      inserted += entries.length;
    }

    return { inserted, resultMap };
  }

  async deleteTokens(item: Record<string, AWSLambda.AttributeValue>, resultMap = new Map<string, number>()) {
    const items: Record<string, AttributeValue>[] = [];
    let exclusiveStartKey: Record<string, AttributeValue> | undefined = undefined;
    do {
      const encodedKeys = this.getEncodedKeys(item);
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
    let deleted = 0;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      await this.client.send(new BatchWriteItemCommand({
        RequestItems: {
          [this.indexTableName]: items.slice(i, i + BATCH_SIZE).map((keys) => ({
            DeleteRequest: { Key: keys },
          })),
        },
      }));
      deleted += items.length;
    }

    return { deleted, resultMap };
  }

  async exportTokensAsFile(path: string, item: Record<string, AWSLambda.AttributeValue>, resultMap = new Map<string, number>(), metadata = true) {
    let inserted = 0;
    let text = '';
    for (let i = 0; i < this.attributes.length; i++) {
      const tokens = new Map<string, number[]>();
      const attributeValues = (this.attributes[i].mapper ?? extractStringValues)(item[this.attributes[i].name]);
      const result = (await Promise.all(attributeValues.map(str => this.attributes[i].analyzer.analyze(str)))).flat();
      resultMap.set(this.attributes[i].name, (resultMap.get(this.attributes[i].name) ?? 0) + result.length);
      for (let j = 0; j < result.length; j++) {
        if (tokens.has(result[j].token)) {
          tokens.get(result[j].token)!.push(result[j].position);
        } else {
          tokens.set(result[j].token, [result[j].position]);
        }
      }
      for (const [token, positions] of tokens.entries()) {
        const encodedKeys = this.getEncodedKeys(item);
        const hash = createHash('md5').update(encodedKeys).digest();
        const buffer = Buffer.allocUnsafe(14);
        buffer.writeUInt16BE(Math.min(2 ** 16 - 1, positions.length), 0);
        buffer.writeUInt32BE(Math.min(2 ** 32 - 1, result.length), 2);
        hash.copy(buffer, 6, 0, 8);
        const data = {
          [DynamoSearch.ATTR_PK]: { S: `${this.attributes[i].shortName || this.attributes[i].name};${token}` },
          [DynamoSearch.ATTR_SK]: { B: buffer.toString('base64') },
          [DynamoSearch.ATTR_KEYS]: { S: encodedKeys },
          [DynamoSearch.ATTR_HASH]: { B: hash.subarray(0, 1).toString('base64') },
          [DynamoSearch.ATTR_POSITION]: { L: positions.map(pos => ({ N: pos.toString() })) },
        };
        text += JSON.stringify({ Item: data }) + '\n';
      }
      inserted += tokens.size;
    }
    if (metadata) {
      const data = {
        [DynamoSearch.ATTR_PK]: { S: '_' },
        [DynamoSearch.ATTR_SK]: { B: Buffer.alloc(1).toString('base64') },
        [DynamoSearch.ATTR_META_DOCUMENT_COUNT]: { N: inserted.toString() },
        ...Object.fromEntries([...resultMap.entries()].map(([attributeName, value]) => {
          const shortName = this.attributes.find(attr => attr.name === attributeName)?.shortName ?? attributeName;
          return [`${DynamoSearch.ATTR_META_TOKEN_COUNT}:${shortName}`, { N: value.toString() }];
        })),
      };
      text += JSON.stringify({ Item: data }) + '\n';
    }
    await appendFile(path, text);

    return { inserted, resultMap };
  }

  async getIndexMetadata(): Promise<IndexMetadata> {
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

  async updateIndexMetadata({ docCount, tokenCount }: IndexMetadata) {
    const updateExpressions = ['#attr = if_not_exists(#attr, :zero) + :val'];
    const expressionAttributeNames: Record<string, string> = {
      '#attr': DynamoSearch.ATTR_META_DOCUMENT_COUNT,
    };
    const expressionAttributeValues: Record<string, AttributeValue> = {
      ':zero': { N: '0' },
      ':val': { N: docCount.toString() },
    };
    const entries = [...tokenCount.entries()];
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
      if (record.eventName === 'MODIFY' || record.eventName === 'REMOVE') {
        const { deleted } = await this.deleteTokens(record.dynamodb!.Keys!, resultMap);
        if (deleted > 0) count--;
      }
      if (record.eventName === 'MODIFY' || record.eventName === 'INSERT') {
        const { inserted } = await this.insertTokens(record.dynamodb!.NewImage!, resultMap);
        if (inserted > 0) count++;
      }
    }
    await this.updateIndexMetadata({ docCount: count, tokenCount: resultMap });
  }

  async reindex(items: Record<string, AttributeValue>[]) {
    let count = 0;
    const resultMap = new Map<string, number>();
    for (let i = 0; i < items.length; i++) {
      const encoded = Object.fromEntries(Object.entries(items[i]).map(([key, value]) => [key, encodeBinaryAttribute(value)]));
      const { deleted } = await this.deleteTokens(encoded, resultMap);
      if (deleted > 0) count--;
      const { inserted } = await this.insertTokens(encoded, resultMap);
      if (inserted > 0) count++;
    }
    await this.updateIndexMetadata({ docCount: count, tokenCount: resultMap });
  }

  private _query(query: Query, indexMetadata: IndexMetadata): Promise<{ items: Map<string, number>; consumedCapacity: number }> {
    if ('match' in query) {
      return this.matchQuery(query.match, indexMetadata);
    }
    if ('matchPhrase' in query) {
      return this.matchQuery(query.matchPhrase, indexMetadata, { phrase: true });
    }
    if ('multiMatch' in query) {
      return this.multiMatchQuery(query.multiMatch, indexMetadata);
    }
    if ('simpleQueryString' in query) {
      return this.simpleQueryStringQuery(query.simpleQueryString, indexMetadata);
    }
    if ('bool' in query) {
      return this.booleanQuery(query.bool, indexMetadata);
    }
    throw new Error(`Unknown query type: "${Object.keys(query)[0]}"`);
  }

  private async booleanQuery(query: BooleanQuery, indexMetadata: IndexMetadata) {
    let consumedCapacity = 0;
    const items = new Map<string, number>();

    if (query.must) {
      const candidates = new Map<string, { count: number, score: number }>();
      for (let i = 0; i < query.must.length; i++) {
        const result = await this._query(query.must[i], indexMetadata);
        for (const [encodedKeys, score] of result.items.entries()) {
          candidates.set(encodedKeys, { count: (candidates.get(encodedKeys)?.count ?? 0) + 1, score: (candidates.get(encodedKeys)?.score ?? 0) + score });
        }
        consumedCapacity += result.consumedCapacity;
      }
      for (const [encodedKeys, { count, score }] of candidates.entries()) {
        if (count === query.must.length) {
          items.set(encodedKeys, (items.get(encodedKeys) ?? 0) + score);
        }
      }
    }
    if (query.filter) {
      const candidates = new Map<string, { count: number }>();
      for (let i = 0; i < query.filter.length; i++) {
        const result = await this._query(query.filter[i], indexMetadata);
        for (const encodedKeys of result.items.keys()) {
          candidates.set(encodedKeys, { count: (candidates.get(encodedKeys)?.count ?? 0) + 1 });
        }
        consumedCapacity += result.consumedCapacity;
      }
      for (const [encodedKeys, { count }] of candidates.entries()) {
        if (count === query.filter.length && ((query.must || []).length === 0 || items.has(encodedKeys))) {
          items.set(encodedKeys, items.get(encodedKeys) ?? 0);
        }
      }
    }
    if (query.should) {
      const candidates = new Map<string, { count: number, score: number }>();
      for (let i = 0; i < query.should.length; i++) {
        const result = await this._query(query.should[i], indexMetadata);
        for (const [encodedKeys, score] of result.items.entries()) {
          candidates.set(encodedKeys, { count: (candidates.get(encodedKeys)?.count ?? 0) + 1, score: (candidates.get(encodedKeys)?.score ?? 0) + score });
        }
        consumedCapacity += result.consumedCapacity;
      }
      for (const [encodedKeys, { count, score }] of candidates.entries()) {
        if (count >= (query.minimumShouldMatch ?? 1) && (((query.must || []).length === 0 && (query.filter || []).length === 0) || items.has(encodedKeys))) {
          items.set(encodedKeys, (items.get(encodedKeys) ?? 0) + score);
        }
      }
    }
    if (query.mustNot) {
      for (let i = 0; i < query.mustNot.length; i++) {
        const result = await this._query(query.mustNot[i], indexMetadata);
        for (const [encodedKeys] of result.items.entries()) {
          items.delete(encodedKeys);
        }
      }
    }

    return { items, consumedCapacity };
  }

  private async matchQuery(query: MatchQuery & MatchPhraseQuery, indexMetadata: IndexMetadata, { phrase }: { phrase?: boolean } = {}) {
    let consumedCapacity = 0;
    const items = new Map<string, number>();

    const attributeName = Object.keys(query)[0];
    const attribute = this.attributes.find(attr => attr.name === attributeName)!;
    const tokens = await attribute.analyzer.analyze(typeof query[attributeName] === 'string' ? query[attributeName] : query[attributeName].query);
    const words = [...new Set(tokens.map(token => token.token))];
    const results = await Promise.all(words.map(word => this.client.send(new QueryCommand({
      TableName: this.indexTableName,
      KeyConditionExpression: '#pk = :pk',
      ProjectionExpression: '#sk, #keys, #pos',
      ExpressionAttributeNames: {
        '#pk': DynamoSearch.ATTR_PK,
        '#sk': DynamoSearch.ATTR_SK,
        '#keys': DynamoSearch.ATTR_KEYS,
        '#pos': DynamoSearch.ATTR_POSITION,
      },
      ExpressionAttributeValues: {
        ':pk': { S: `${attribute.shortName || attribute.name};${word}` },
      },
      ReturnConsumedCapacity: 'TOTAL',
      ScanIndexForward: false,
    }))));
    const candidates = new Map<string, { token: string; positions: number[]; score: number }[]>();
    const boost = typeof query[attributeName] !== 'string' ? (query[attributeName].boost ?? 1) : 1;
    for (let i = 0; i < results.length; i++) {
      const { Items, ConsumedCapacity } = results[i];
      consumedCapacity += ConsumedCapacity?.CapacityUnits ?? 0;
      if (Items) {
        const idf = Math.log(1 + (indexMetadata.docCount - Items.length + 0.5) / (Items.length + 0.5));
        Items.forEach((item) => {
          const occurrence = Buffer.from(item[DynamoSearch.ATTR_SK].B!).readUInt16BE(0);
          const tokenCount = Buffer.from(item[DynamoSearch.ATTR_SK].B!).readUInt32BE(2);
          const encodedKeys = item[DynamoSearch.ATTR_KEYS].S!;
          const positions = item[DynamoSearch.ATTR_POSITION].L!.map(pos => parseInt(pos.N!));
          const averageTokenCount = indexMetadata.tokenCount.get(attribute.name)! / indexMetadata.docCount;
          const tf = occurrence / (occurrence + this.bm25.k1 * (1 - this.bm25.b + this.bm25.b * (tokenCount / averageTokenCount)));
          const score = boost * tf * idf * (this.bm25.k1 + 1);
          if (candidates.has(encodedKeys)) {
            candidates.get(encodedKeys)!.push({ token: words[i], positions, score });
          } else {
            candidates.set(encodedKeys, [{ token: words[i], positions, score }]);
          }
        });
      }
    }
    if (phrase) {
      const slop = typeof query[attributeName] !== 'string' ? (query[attributeName].slop ?? 0) : 0;
      for (const [encodedKeys, tokenDetails] of candidates.entries()) {
        if (this.checkPhraseMatch(tokens.map(t => t.position), tokens.map(t => tokenDetails.find(d => d.token === t.token)?.positions ?? []), slop)) {
          items.set(encodedKeys, (items.get(encodedKeys) ?? 0) + tokenDetails.reduce((acc, cur) => acc + cur.score, 0));
        }
      }
    } else {
      const operator = typeof query[attributeName] !== 'string' ? (query[attributeName].operator ?? 'OR') : 'OR';
      const minimumShouldMatch = typeof query[attributeName] !== 'string' ? (query[attributeName].minimumShouldMatch ?? 1) : 1;
      for (const [encodedKeys, tokenDetails] of candidates.entries()) {
        if ((operator === 'AND' && tokenDetails.length === words.length) || (operator === 'OR' && tokenDetails.length >= minimumShouldMatch)) {
          items.set(encodedKeys, (items.get(encodedKeys) ?? 0) + tokenDetails.reduce((acc, cur) => acc + cur.score, 0));
        }
      }
    }

    return { items, consumedCapacity };
  }

  private multiMatchQuery({ query, type = 'best_fields', fields = ['*'], ...options }: MultiMatchQuery, indexMetadata: IndexMetadata) {
    const attributes: (Attribute & { boost: number })[] = [];
    for (let i = 0; i < this.attributes.length; i++) {
      for (let j = 0; j < fields.length; j++) {
        const attributeName = fields[j].split('^')[0];
        if (new RegExp(`^${attributeName.replaceAll('*', '.*')}$`).test(this.attributes[i].name)) {
          attributes.push({ ...this.attributes[i], boost: parseFloat(fields[j].split('^')[1] || '1') });
          break;
        }
      }
    }
    if (type === 'best_fields' || type === 'most_fields') {
      return this.booleanQuery({
        should: attributes.map(attr => ({
          match: { [attr.name]: { query, boost: attr.boost, ...options } },
        })),
      }, indexMetadata);
    }
    if (type === 'phrase') {
      return this.booleanQuery({
        should: attributes.map(attr => ({
          matchPhrase: { [attr.name]: { query, boost: attr.boost, ...options } },
        })),
      }, indexMetadata);
    }
    throw new Error(`Unknown query type: "${type}"`);
  }

  private simpleQueryStringQuery({ query, fields = ['*'], defaultOperator = 'OR' }: SimpleQueryStringQuery, indexMetadata: IndexMetadata) {
    return this._query(parse(query, { fields, defaultOperator }), indexMetadata);
  }

  /**
   * @param queryPositions - positions in query (e.g. [0, 1, 2])
   * @param docPositions   - positions of each token in document (e.g. [[5, 10], [6, 11], [7, 12]])
   * @param slop           - allowed distance between tokens
   */
  private checkPhraseMatch(queryPositions: number[], docPositions: number[][], slop: number) {
    if (queryPositions.length === 0 || docPositions.length === 0) {
      return false;
    }
    const findMatches = (tokenIndex: number, currentPositions: number[]): boolean => {
      if (tokenIndex === queryPositions.length) {
        for (let i = 1; i < currentPositions.length; i++) {
          const expectedDistance = queryPositions[i] - queryPositions[i - 1];
          const actualDistance = currentPositions[i] - currentPositions[i - 1];
          if (actualDistance < expectedDistance || actualDistance > expectedDistance + slop) {
            return false;
          }
        }
        return true;
      }
      for (const pos of docPositions[tokenIndex]) {
        if (currentPositions.length === 0 || pos > currentPositions[currentPositions.length - 1]) {
          if (findMatches(tokenIndex + 1, [...currentPositions, pos])) {
            return true;
          }
        }
      }
      return false;
    };

    return findMatches(0, []);
  }

  async query({ query, size = 10, minScore = 0 }: { query: Query, size?: number; minScore?: number }) {
    const indexMetadata = await this.getIndexMetadata();
    const { items, consumedCapacity } = await this._query(query, indexMetadata);

    return {
      items: [...items.entries()]
        .filter(([, score]) => score >= minScore)
        .sort(([, score_A], [, score_B]) => score_B - score_A)
        .slice(0, size)
        .map(([key, score]) => ({
          keys: this.getDecodedKeys(key),
          score,
        })),
      consumedCapacity: {
        capacityUnits: consumedCapacity,
        tableName: this.indexTableName,
      },
    };
  }

  async search(query: string, { attributes, operator = 'OR', minimumShouldMatch, maxItems = 10, minScore = 0 }: SearchOptions = {}) {
    const _attributes: (Attribute & { boost?: number })[] = attributes?.map((attributeName) => {
      const attribute = this.attributes.find(attr => attr.name === attributeName.split('^')[0]);
      const boost = parseFloat(attributeName.split('^')[1] || '1');
      if (!attribute) {
        throw new Error(`Attribute not found: ${attributeName}`);
      }
      return { ...attribute, boost };
    }) ?? this.attributes;

    return this.query({
      query: {
        bool: {
          should: _attributes.map(attr => ({
            match: { [attr.name]: { query, operator, minimumShouldMatch } },
          })),
        },
      },
      size: maxItems,
      minScore,
    });
  }
}

export default DynamoSearch;
