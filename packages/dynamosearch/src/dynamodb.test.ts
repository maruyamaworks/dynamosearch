import { test, beforeAll } from 'vitest';
import { DynamoDBClient, CreateTableCommand, DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import type { DynamoDBStreamEvent } from 'aws-lambda';
import StandardAnalyzer from './analyzers/StandardAnalyzer.js';
import { processRecords } from './dynamodb.js';

beforeAll(async () => {
  const client = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
  });
  try {
    await client.send(new DeleteTableCommand({
      TableName: 'dynamosearch_test',
    }));
  } catch (e) {
    //
  }
  await client.send(new CreateTableCommand({
    TableName: 'dynamosearch_test',
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
});

test('processRecords', async () => {
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
      /*
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
      */
    ],
  };
  const standardAnalyzer = await StandardAnalyzer.getInstance();
  await processRecords(event.Records, {
    indexTableName: 'dynamosearch_test',
    attributes: [{ name: 'Message', analyzer: standardAnalyzer }],
    keys: [{ name: 'Id', type: 'HASH' }],
  });
});
