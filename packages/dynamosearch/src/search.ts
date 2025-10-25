import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import type Analyzer from './analyzers/Analyzer.js';

const search = async (query: string, { indexTableName, analyzer }: { indexTableName: string; analyzer: Analyzer }) => {
  const client = new DynamoDBClient();
  const tokens = analyzer.analyze(query);
  const words = [...new Set(tokens.map(token => token.text))];
  const candidates = new Map<string, number>();
  for (let i = 0; i < words.length; i++) {
    const command = new QueryCommand({
      TableName: indexTableName,
      KeyConditionExpression: '#token = :token',
      ExpressionAttributeNames: {
        '#token': 'token',
      },
      ExpressionAttributeValues: {
        ':token': { S: words[i] },
      },
      ReturnConsumedCapacity: 'TOTAL',
    });
    const { Items, ConsumedCapacity } = await client.send(command);
    console.log(ConsumedCapacity);
    Items?.forEach((item) => {
      candidates.set(item.documentId.S!, (candidates.get(item.documentId.S!) ?? 0) + Number(item.occurrences.N));
    });
  }

  return [...candidates.entries()].map(([documentId, score]) => ({ documentId, score }));
};

export default search;
