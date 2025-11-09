import { test, expect, beforeAll } from 'vitest';
import { DynamoDBClient, BatchWriteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import type { DynamoDBStreamEvent } from 'aws-lambda';
import StandardAnalyzer from './analyzers/StandardAnalyzer.js';
import DynamoSearch from './index.js';

beforeAll(async () => {
  const analyzer = await StandardAnalyzer.getInstance();
  const dynamosearch = new DynamoSearch({
    indexTableName: 'dynamosearch_test',
    attributes: [{ name: 'Message', analyzer }],
    keys: [{ name: 'Id', type: 'HASH' }],
  });
  await dynamosearch.deleteIndexTable({ ifExists: true });
  await dynamosearch.createIndexTable();
});

test('processRecords (INSERT)', async () => {
  const event: DynamoDBStreamEvent = {
    Records: [
      {
        eventID: '1',
        eventName: 'INSERT',
        eventVersion: '1.0',
        eventSource: 'aws:dynamodb',
        awsRegion: 'us-east-1',
        dynamodb: {
          Keys: {
            Id: { N: '101' },
          },
          NewImage: {
            Message: { S: 'New item!' },
            Id: { N: '101' },
          },
          SequenceNumber: '111',
          SizeBytes: 26,
          StreamViewType: 'NEW_AND_OLD_IMAGES',
        },
        eventSourceARN: 'stream-ARN',
      },
    ],
  };
  const analyzer = await StandardAnalyzer.getInstance();
  const dynamosearch = new DynamoSearch({
    indexTableName: 'dynamosearch_test',
    attributes: [{ name: 'Message', analyzer }],
    keys: [{ name: 'Id', type: 'HASH' }],
  });
  await dynamosearch.processRecords(event.Records);

  const client = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
  });
  const { Items } = await client.send(new ScanCommand({
    TableName: 'dynamosearch_test',
  }));
  expect(Items).toHaveLength(3);
  expect(Items).toEqual(expect.arrayContaining([
    {
      p: { S: '_' },
      s: { B: new Uint8Array([0]) },
      dc: { N: '1' },
      'tc:Message': { N: '2' },
    },
    {
      p: { S: 'Message;new' },
      s: { B: new Uint8Array([0, 1, 0, 0, 0, 2, 232, 244, 177, 186, 163, 88, 89, 159]) },
      k: { S: 'N101' },
      h: { B: new Uint8Array([232]) },
    },
    {
      p: { S: 'Message;item!' },
      s: { B: new Uint8Array([0, 1, 0, 0, 0, 2, 232, 244, 177, 186, 163, 88, 89, 159]) },
      k: { S: 'N101' },
      h: { B: new Uint8Array([232]) },
    },
  ]));
});

test('search', async () => {
  const client = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
  });
  await client.send(new BatchWriteItemCommand({
    RequestItems: {
      'dynamosearch_test': [
        {
          PutRequest: {
            Item: {
              p: { S: '_' },
              s: { B: new Uint8Array([0]) },
              dc: { N: '1' },
              'tc:Message': { N: '2' },
            },
          },
        },
        {
          PutRequest: {
            Item: {
              p: { S: 'Message;new' },
              s: { B: new Uint8Array([0, 1, 0, 0, 0, 2, 232, 244, 177, 186, 163, 88, 89, 159]) },
              k: { S: 'N101' },
              h: { B: new Uint8Array([232]) },
            },
          },
        },
        {
          PutRequest: {
            Item: {
              p: { S: 'Message;item!' },
              s: { B: new Uint8Array([0, 1, 0, 0, 0, 2, 232, 244, 177, 186, 163, 88, 89, 159]) },
              k: { S: 'N101' },
              h: { B: new Uint8Array([232]) },
            },
          },
        },
      ],
    },
  }));
  const analyzer = await StandardAnalyzer.getInstance();
  const dynamosearch = new DynamoSearch({
    indexTableName: 'dynamosearch_test',
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

test('processRecords (MODIFY)', async () => {
  const event: DynamoDBStreamEvent = {
    Records: [
      {
        eventID: '2',
        eventName: 'MODIFY',
        eventVersion: '1.0',
        eventSource: 'aws:dynamodb',
        awsRegion: 'us-east-1',
        dynamodb: {
          Keys: {
            Id: { N: '101' },
          },
          NewImage: {
            Message: { S: 'This item has changed' },
            Id: { N: '101' },
          },
          OldImage: {
            Message: { S: 'New item!' },
            Id: { N: '101' },
          },
          SequenceNumber: '222',
          SizeBytes: 59,
          StreamViewType: 'NEW_AND_OLD_IMAGES',
        },
        eventSourceARN: 'stream-ARN',
      },
    ],
  };
  const analyzer = await StandardAnalyzer.getInstance();
  const dynamosearch = new DynamoSearch({
    indexTableName: 'dynamosearch_test',
    attributes: [{ name: 'Message', analyzer }],
    keys: [{ name: 'Id', type: 'HASH' }],
  });
  await dynamosearch.processRecords(event.Records);

  const client = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
  });
  const { Items } = await client.send(new ScanCommand({
    TableName: 'dynamosearch_test',
  }));
  expect(Items).toHaveLength(5);
  expect(Items).toEqual(expect.arrayContaining([
    {
      p: { S: '_' },
      s: { B: new Uint8Array([0]) },
      dc: { N: '1' },
      'tc:Message': { N: '4' },
    },
    {
      p: { S: 'Message;this' },
      s: { B: new Uint8Array([0, 1, 0, 0, 0, 4, 232, 244, 177, 186, 163, 88, 89, 159]) },
      k: { S: 'N101' },
      h: { B: new Uint8Array([232]) },
    },
    {
      p: { S: 'Message;item' },
      s: { B: new Uint8Array([0, 1, 0, 0, 0, 4, 232, 244, 177, 186, 163, 88, 89, 159]) },
      k: { S: 'N101' },
      h: { B: new Uint8Array([232]) },
    },
    {
      p: { S: 'Message;has' },
      s: { B: new Uint8Array([0, 1, 0, 0, 0, 4, 232, 244, 177, 186, 163, 88, 89, 159]) },
      k: { S: 'N101' },
      h: { B: new Uint8Array([232]) },
    },
    {
      p: { S: 'Message;changed' },
      s: { B: new Uint8Array([0, 1, 0, 0, 0, 4, 232, 244, 177, 186, 163, 88, 89, 159]) },
      k: { S: 'N101' },
      h: { B: new Uint8Array([232]) },
    },
  ]));
});

test('processRecords (REMOVE)', async () => {
  const event: DynamoDBStreamEvent = {
    Records: [
      {
        eventID: '3',
        eventName: 'REMOVE',
        eventVersion: '1.0',
        eventSource: 'aws:dynamodb',
        awsRegion: 'us-east-1',
        dynamodb: {
          Keys: {
            Id: { N: '101' },
          },
          OldImage: {
            Message: { S: 'This item has changed' },
            Id: { N: '101' },
          },
          SequenceNumber: '333',
          SizeBytes: 38,
          StreamViewType: 'NEW_AND_OLD_IMAGES',
        },
        eventSourceARN: 'stream-ARN',
      },
    ],
  };
  const analyzer = await StandardAnalyzer.getInstance();
  const dynamosearch = new DynamoSearch({
    indexTableName: 'dynamosearch_test',
    attributes: [{ name: 'Message', analyzer }],
    keys: [{ name: 'Id', type: 'HASH' }],
  });
  await dynamosearch.processRecords(event.Records);

  const client = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
  });
  const { Items } = await client.send(new ScanCommand({
    TableName: 'dynamosearch_test',
  }));
  expect(Items).toHaveLength(1);
  expect(Items).toEqual(expect.arrayContaining([
    {
      p: { S: '_' },
      s: { B: new Uint8Array([0]) },
      dc: { N: '0' },
      'tc:Message': { N: '0' },
    },
  ]));
});
