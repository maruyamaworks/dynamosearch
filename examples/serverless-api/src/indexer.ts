import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';
import type { DynamoDBStreamHandler } from 'aws-lambda';

export const handler: DynamoDBStreamHandler = async (event) => {
  console.log('Received stream records:', event.Records.length);

  const analyzer = await StandardAnalyzer.getInstance();
  const dynamosearch = new DynamoSearch({
    indexTableName: process.env.INDEX_TABLE_NAME!,
    attributes: [
      { name: 'title', analyzer },
      { name: 'description', analyzer },
    ],
    keys: [
      { name: 'id', type: 'HASH' },
    ],
  });
  await dynamosearch.processRecords(event.Records);

  console.log('Successfully processed records');
};
