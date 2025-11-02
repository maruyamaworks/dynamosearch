import { createHash } from 'node:crypto';
import {
  DynamoDBClient,
  BatchWriteItemCommand,
  CreateTableCommand,
  DeleteTableCommand,
  QueryCommand,
  ResourceInUseException,
  ResourceNotFoundException,
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

  async insertTokens(record: DynamoDBRecord) {
    const tokens = new Map<string, number>();
    for (let i = 0; i < this.attributes.length; i++) {
      const result = this.attributes[i].analyzer.analyze(record.dynamodb!.NewImage![this.attributes[i].name].S ?? '');
      for (let i = 0; i < result.length; i++) {
        tokens.set(result[i].text, (tokens.get(result[i].text) ?? 0) + 1);
      }
    }
    const entries = [...tokens.entries()];
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      await this.client.send(new BatchWriteItemCommand({
        RequestItems: {
          [this.indexTableName]: entries.slice(i, i + BATCH_SIZE).map((entry) => {
            const tf = Math.min(entry[1], 0xffff).toString(16).padStart(4, '0');
            const keys = [
              record.dynamodb!.Keys![this.partitionKeyName],
              ...(this.sortKeyName ? [record.dynamodb!.Keys![this.sortKeyName]] : []),
            ];
            const item = {
              token: { S: entry[0] },
              tfkeys: { S: JSON.stringify([tf, ...keys]) },
              keys: { S: JSON.stringify(keys) },
              hash: { B: createHash('md5').update(JSON.stringify(keys)).digest() },
            };
            return { PutRequest: { Item: item } };
          }),
        },
      }));
    }
  }

  async deleteTokens(record: DynamoDBRecord) {
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

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      await this.client.send(new BatchWriteItemCommand({
        RequestItems: {
          [this.indexTableName]: items.slice(i, i + BATCH_SIZE).map((item) => ({
            DeleteRequest: { Key: item },
          })),
        },
      }));
    }
  }

  async processRecords(records: DynamoDBRecord[]) {
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      switch (record.eventName) {
        case 'INSERT':
          await this.insertTokens(record);
          break;
        case 'MODIFY':
          await this.deleteTokens(record);
          await this.insertTokens(record);
          break;
        case 'REMOVE':
          await this.deleteTokens(record);
          break;
        default:
          throw new Error(`Unknown eventName: ${record.eventName}`);
      }
    }
  }

  async search(query: string) {
    const tokens = this.attributes[0].analyzer.analyze(query);
    const words = [...new Set(tokens.map(token => token.text))];
    const candidates = new Map<string, number>();
    for (let i = 0; i < words.length; i++) {
      const command = new QueryCommand({
        TableName: this.indexTableName,
        KeyConditionExpression: '#token = :token',
        ProjectionExpression: '#token, tfkeys',
        ExpressionAttributeNames: {
          '#token': 'token',
        },
        ExpressionAttributeValues: {
          ':token': { S: words[i] },
        },
        ReturnConsumedCapacity: 'TOTAL',
      });
      const { Items, ConsumedCapacity } = await this.client.send(command);
      console.log(ConsumedCapacity);
      Items?.forEach((item) => {
        const [tf, ...keys] = JSON.parse(item.tfkeys.S!);
        candidates.set(JSON.stringify(keys), (candidates.get(JSON.stringify(keys)) ?? 0) + parseInt(tf, 16));
      });
    }

    return [...candidates.entries()].map(([key, score]) => ({
      keys: {
        [this.partitionKeyName]: JSON.parse(key)[0],
        ...(this.sortKeyName ? { [this.sortKeyName]: JSON.parse(key)[1] } : {}),
      },
      score,
    }));
  }
}

export default DynamoSearch;
