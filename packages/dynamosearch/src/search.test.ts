import { test, expect, beforeAll } from 'vitest';
import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import StandardAnalyzer from './analyzers/StandardAnalyzer.js';
import DynamoSearch from './index.js';

beforeAll(async () => {
  const analyzer = await StandardAnalyzer.getInstance();
  const dynamosearch = new DynamoSearch({
    indexTableName: 'dynamosearch_test-search',
    attributes: [{ name: 'Message', analyzer }],
    keys: [{ name: 'Id', type: 'HASH' }],
  });
  await dynamosearch.deleteIndexTable();
  await dynamosearch.createIndexTable();

  const client = new DynamoDBClient({ endpoint: 'http://localhost:8000' });
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
  const analyzer = await StandardAnalyzer.getInstance();
  const dynamosearch = new DynamoSearch({
    indexTableName: 'dynamosearch_test-search',
    attributes: [{ name: 'Message', analyzer }],
    keys: [{ name: 'Id', type: 'HASH' }],
  });
  const result = await dynamosearch.search('New item!');
  expect(result).toEqual([
    {
      documentId: { N: '101' },
      score: 2,
    },
  ]);
});
