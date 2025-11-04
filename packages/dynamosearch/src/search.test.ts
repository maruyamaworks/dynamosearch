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
  await dynamosearch.deleteIndexTable({ ifExists: true });
  await dynamosearch.createIndexTable();

  const client = new DynamoDBClient({ endpoint: 'http://localhost:8000' });
  await client.send(new BatchWriteItemCommand({
    RequestItems: {
      'dynamosearch_test-search': [
        {
          PutRequest: {
            Item: {
              token: { S: '#metadata' },
              tfkeys: { S: '[]' },
              doc_count: { N: '1' },
              'token_count:Message': { N: '2' },
            },
          },
        },
        {
          PutRequest: {
            Item: {
              token: { S: 'Message/new' },
              tfkeys: { S: '["0001","0002",{"N":"101"}]' },
              keys: { S: '[{"N":"101"}]' },
              hash: { B: Buffer.from('4f8d90f01753c40e0f7e1ac2e61034da', 'hex') },
            },
          },
        },
        {
          PutRequest: {
            Item: {
              token: { S: 'Message/item!' },
              tfkeys: { S: '["0001","0002",{"N":"101"}]' },
              keys: { S: '[{"N":"101"}]' },
              hash: { B: Buffer.from('4f8d90f01753c40e0f7e1ac2e61034da', 'hex') },
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
  const { items } = await dynamosearch.search('New item!');
  expect(items).toEqual([
    {
      keys: {
        Id: { N: '101' },
      },
      score: expect.closeTo(0.575),
    },
  ]);
});
