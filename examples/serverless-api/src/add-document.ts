import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  try {
    const document = JSON.parse(event.body);

    if (!document.title || !document.description) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields: title and description' }),
      };
    }

    const id = document.id || randomUUID();

    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    await client.send(new PutCommand({
      TableName: process.env.DOCUMENTS_TABLE_NAME!,
      Item: {
        id,
        title: document.title,
        description: document.description,
      },
    }));

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    console.error('Add document error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
