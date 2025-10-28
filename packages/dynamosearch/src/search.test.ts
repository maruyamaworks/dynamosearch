import { test, expect, beforeAll } from 'vitest';
import { DynamoDBClient, CreateTableCommand, DeleteTableCommand, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import StandardAnalyzer from './analyzers/StandardAnalyzer.js';
import search from './search.js';

beforeAll(async () => {
  const client = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
  });
  try {
    await client.send(new DeleteTableCommand({
      TableName: 'dynamosearch_test-search',
    }));
  } catch (e) {
    //
  }
  await client.send(new CreateTableCommand({
    TableName: 'dynamosearch_test-search',
    AttributeDefinitions: [
      { AttributeName: 'token', AttributeType: 'S' },
      { AttributeName: 'documentId', AttributeType: 'N' },
    ],
    KeySchema: [
      { AttributeName: 'token', KeyType: 'HASH' },
      { AttributeName: 'documentId', KeyType: 'RANGE' },
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'documentId-index',
      KeySchema: [{ AttributeName: 'documentId', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'KEYS_ONLY' },
    }],
    BillingMode: 'PAY_PER_REQUEST',
  }));
  await client.send(new BatchWriteItemCommand({
    RequestItems: {
      'dynamosearch_test-search': [
        {
          PutRequest: {
            Item: {
              token: { S: 'new' },
              documentId: { N: '101' },
              occurrences: { N: '1' },
            },
          },
        },
        {
          PutRequest: {
            Item: {
              token: { S: 'item!' },
              documentId: { N: '101' },
              occurrences: { N: '1' },
            },
          },
        },
      ],
    },
  }));
});

test('search', async () => {
  const standardAnalyzer = await StandardAnalyzer.getInstance();
  const result = await search('New item!', {
    indexTableName: 'dynamosearch_test-search',
    analyzer: standardAnalyzer,
  });
  expect(result).toEqual([
    {
      documentId: { N: '101' },
      score: 2,
    },
  ]);
});
