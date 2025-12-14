import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer';
import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  const query = event.queryStringParameters?.q;

  if (!query) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing query parameter "q"' }),
    };
  }

  try {
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
    const results = await dynamosearch.search(query, {
      fields: ['title^2', 'description'],
      maxItems: 20,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: results.items,
        total: results.items.length,
      }),
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
