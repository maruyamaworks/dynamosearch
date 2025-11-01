import { test, beforeAll } from 'vitest';
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
  const analyzer = await StandardAnalyzer.getInstance();
  const dynamosearch = new DynamoSearch({
    indexTableName: 'dynamosearch_test',
    attributes: [{ name: 'Message', analyzer }],
    keys: [{ name: 'Id', type: 'HASH' }],
  });
  await dynamosearch.processRecords(event.Records);
});
