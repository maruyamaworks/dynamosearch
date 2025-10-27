import { DynamoDBClient, QueryCommand, BatchWriteItemCommand, type AttributeValue } from '@aws-sdk/client-dynamodb';
import type { DynamoDBRecord } from 'aws-lambda';
import type Analyzer from './analyzers/Analyzer.js';

const BATCH_SIZE = 25;
const INDEX_NAME = 'documentId-index';

export interface RecordProcessorOptions {
  indexTableName: string;
  attributes: { name: string; analyzer: Analyzer }[];
  keys: { name: string; type: 'HASH' | 'RANGE' }[];
}

const deleteTokens = async (client: DynamoDBClient, record: DynamoDBRecord, { indexTableName, keys }: RecordProcessorOptions) => {
  const items: Record<string, AttributeValue>[] = [];
  let exclusiveStartKey: Record<string, AttributeValue> | undefined = undefined;
  do {
    const { Items, LastEvaluatedKey }: { Items?: Record<string, AttributeValue>[]; LastEvaluatedKey?: Record<string, AttributeValue> } = await client.send(new QueryCommand({
      TableName: indexTableName,
      IndexName: INDEX_NAME,
      KeyConditionExpression: 'documentId = :id',
      ExpressionAttributeValues: {
        ':id': record.dynamodb!.Keys![keys.find(key => key.type === 'HASH')!.name] as AttributeValue,
      },
      ExclusiveStartKey: exclusiveStartKey,
    }));
    if (Items) items.push(...Items);
    exclusiveStartKey = LastEvaluatedKey;
  } while (exclusiveStartKey);

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    await client.send(new BatchWriteItemCommand({
      RequestItems: {
        [indexTableName]: items.slice(i, i + BATCH_SIZE).map((item) => ({
          DeleteRequest: { Key: item },
        })),
      },
    }));
  }
};

const insertTokens = async (client: DynamoDBClient, record: DynamoDBRecord, { indexTableName, attributes, keys }: RecordProcessorOptions) => {
  const tokens = new Map();
  for (let i = 0; i < attributes.length; i++) {
    const result = attributes[i].analyzer.analyze(record.dynamodb!.NewImage![attributes[i].name].S ?? '');
    for (let i = 0; i < result.length; i++) {
      tokens.set(result[i].text, (tokens.get(result[i].text) ?? 0) + 1);
    }
  }
  const entries = [...tokens.entries()];
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    await client.send(new BatchWriteItemCommand({
      RequestItems: {
        [indexTableName]: entries.slice(i, i + BATCH_SIZE).map((entry) => ({
          PutRequest: {
            Item: {
              token: { S: entry[0] },
              documentId: record.dynamodb!.Keys![keys.find(key => key.type === 'HASH')!.name] as AttributeValue,
              occurrences: { N: String(entry[1]) },
            },
          },
        })),
      },
    }));
  }
}

export const processRecords = async (records: DynamoDBRecord[], options: RecordProcessorOptions) => {
  const client = new DynamoDBClient({
    endpoint: process.env.NODE_ENV === 'test' ? 'http://localhost:8000' : undefined,
  });
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    switch (record.eventName) {
      case 'INSERT':
        await insertTokens(client, record, options);
        break;
      case 'MODIFY':
        await deleteTokens(client, record, options);
        await insertTokens(client, record, options);
        break;
      case 'REMOVE':
        await deleteTokens(client, record, options);
        break;
      default:
        throw new Error(`Unknown eventName: ${record.eventName}`);
    }
  }
};
