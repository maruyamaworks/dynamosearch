import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer';
import type { DynamoDBStreamHandler } from 'aws-lambda';

export const handler: DynamoDBStreamHandler = async (event) => {
  console.log('Received stream records:', event.Records.length);

  const analyzer = new StandardAnalyzer();
  const dynamosearch = new DynamoSearch({
    indexTableName: process.env.INDEX_TABLE_NAME!,
    fields: [
      { name: 'title', analyzer },
      { name: 'description', analyzer },
    ],
    keySchema: [
      { name: 'id', type: 'HASH' },
    ],
  });
  await dynamosearch.processRecords(event.Records);

  console.log('Successfully processed records');
};
