import {
  DynamoDBClient,
  BatchWriteItemCommand,
  CreateTableCommand,
  DeleteTableCommand,
  QueryCommand,
  type AttributeValue,
} from '@aws-sdk/client-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import type Analyzer from './analyzers/Analyzer.js';

const BATCH_SIZE = 25;
const INDEX_NAME = 'documentId-index';

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
  keys: Key[];

  constructor(options: Options) {
    this.client = new DynamoDBClient({
      endpoint: process.env.NODE_ENV === 'test' ? 'http://localhost:8000' : undefined,
    });
    this.indexTableName = options.indexTableName;
    this.attributes = options.attributes;
    this.keys = options.keys;
  }

  async createIndexTable() {
    await this.client.send(new CreateTableCommand({
      TableName: this.indexTableName,
      AttributeDefinitions: [
        { AttributeName: 'token', AttributeType: 'S' },
        { AttributeName: 'documentId', AttributeType: 'N' },
      ],
      KeySchema: [
        { AttributeName: 'token', KeyType: 'HASH' },
        { AttributeName: 'documentId', KeyType: 'RANGE' },
      ],
      GlobalSecondaryIndexes: [{
        IndexName: INDEX_NAME,
        KeySchema: [{ AttributeName: 'documentId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'KEYS_ONLY' },
      }],
      BillingMode: 'PAY_PER_REQUEST',
    }));
  }

  async deleteIndexTable() {
    await this.client.send(new DeleteTableCommand({
      TableName: this.indexTableName,
    }));
  }

  async insertTokens(record: DynamoDBRecord) {
    const tokens = new Map();
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
          [this.indexTableName]: entries.slice(i, i + BATCH_SIZE).map((entry) => ({
            PutRequest: {
              Item: {
                token: { S: entry[0] },
                documentId: record.dynamodb!.Keys![this.keys.find(key => key.type === 'HASH')!.name] as AttributeValue,
                occurrences: { N: String(entry[1]) },
              },
            },
          })),
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
        IndexName: INDEX_NAME,
        KeyConditionExpression: 'documentId = :id',
        ExpressionAttributeValues: {
          ':id': record.dynamodb!.Keys![this.keys.find(key => key.type === 'HASH')!.name] as AttributeValue,
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
        candidates.set(JSON.stringify(item.documentId), (candidates.get(JSON.stringify(item.documentId)) ?? 0) + Number(item.occurrences.N));
      });
    }

    return [...candidates.entries()].map(([key, score]) => ({
      documentId: JSON.parse(key),
      score,
    }));
  }
}

export default DynamoSearch;
