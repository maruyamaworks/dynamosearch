# AWS Lambda Integration

This guide shows how to deploy DynamoSearch to AWS Lambda using the provided SAM (Serverless Application Model) example.

## Overview

The example in `examples/serverless-api` demonstrates a complete serverless search application with:

- **DocumentsTable**: Source DynamoDB table with Streams enabled
- **SearchIndexTable**: DynamoDB table storing the search index
- **IndexerFunction**: Lambda function that processes Stream events and updates the index
- **SearchFunction**: Lambda function that handles search API requests via API Gateway
- **AddDocumentFunction**: Lambda function that adds documents to the source table

## Prerequisites

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed
- [Node.js 20+](https://nodejs.org/) installed
- AWS credentials configured (`aws configure`)

## Quick Start

### 1. Clone and Navigate to the Example

```bash
cd examples/serverless-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Application

```bash
sam build
```

This compiles the TypeScript Lambda functions using esbuild.

### 4. Deploy to AWS

```bash
sam deploy --guided
```

During the guided deployment:
- **Stack name**: Enter a name (e.g., `dynamosearch-demo`)
- **AWS Region**: Select your preferred region
- **Confirm changes before deploy**: `Y`
- **Allow SAM CLI IAM role creation**: `Y`
- **Save arguments to samconfig.toml**: `Y`

The deployment creates:
- Two DynamoDB tables (source + index)
- Three Lambda functions
- API Gateway with two endpoints
- IAM roles and policies

### 5. Get the API Endpoints

After deployment, note the output URLs:

```
Outputs
-------
AddDocumentUrl: https://<api-id>.execute-api.<region>.amazonaws.com/Prod/documents
SearchUrl: https://<api-id>.execute-api.<region>.amazonaws.com/Prod/search
```

## Usage

### Add Documents

```bash
curl -X POST https://<api-id>.execute-api.<region>.amazonaws.com/Prod/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to AWS Lambda",
    "description": "AWS Lambda is a serverless compute service that runs your code in response to events."
  }'
```

The AddDocumentFunction writes the document to DocumentsTable, which triggers the Stream. The IndexerFunction then processes the Stream event and updates the search index automatically.

### Search Documents

```bash
curl "https://<api-id>.execute-api.<region>.amazonaws.com/Prod/search?q=lambda"
```

Response:

```json
{
  "items": [
    {
      "keys": { "id": { "S": "..." } },
      "score": 2.145
    }
  ],
  "total": 1
}
```

## Architecture

```mermaid
sequenceDiagram
    participant Client
    participant AddAPI as AddDocument API
    participant DB as DocumentsTable
    participant Stream as DynamoDB Streams
    participant Indexer as IndexerFunction
    participant Index as SearchIndexTable
    participant SearchAPI as Search API

    Client->>AddAPI: POST /documents
    AddAPI->>DB: PutItem
    DB->>Stream: Stream Event
    Stream->>Indexer: Trigger Lambda
    Indexer->>Index: Update Index

    Client->>SearchAPI: GET /search?q=...
    SearchAPI->>Index: Query
    Index-->>SearchAPI: Results
    SearchAPI-->>Client: Ranked Results
```

## Lambda Functions

### IndexerFunction (`src/indexer.ts`)

Processes DynamoDB Stream events:

```typescript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';
import type { DynamoDBStreamHandler } from 'aws-lambda';

export const handler: DynamoDBStreamHandler = async (event) => {
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
};
```

### SearchFunction (`src/search.ts`)

Handles search API requests:

```typescript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';
import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  const query = event.queryStringParameters?.q;

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

  const results = await dynamosearch.search(query, {
    attributes: ['title^2', 'description'], // Boost title 2x
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
};
```

## SAM Template Configuration

The `template.yaml` includes optimized settings:

### Runtime and Architecture

```yaml
Globals:
  Function:
    Runtime: nodejs22.x
    Architectures:
      - arm64  # Lower cost, better performance
    MemorySize: 512
    Timeout: 30
```

### Stream Configuration

```yaml
IndexerFunction:
  Events:
    Stream:
      Type: DynamoDB
      Properties:
        Stream: !GetAtt DocumentsTable.StreamArn
        StartingPosition: LATEST
        BatchSize: 100
        MaximumBatchingWindowInSeconds: 5
```

- **BatchSize**: Process up to 100 records per invocation
- **MaximumBatchingWindowInSeconds**: Wait up to 5 seconds to accumulate records

### IAM Policies

```yaml
IndexerFunction:
  Policies:
    - DynamoDBCrudPolicy:
        TableName: !Ref SearchIndexTable
    - DynamoDBStreamReadPolicy:
        TableName: !Ref DocumentsTable

SearchFunction:
  Policies:
    - DynamoDBReadPolicy:
        TableName: !Ref SearchIndexTable
```

## Local Development

### Start Local API

```bash
sam local start-api
```

This starts a local API Gateway emulator at `http://127.0.0.1:3000`.

### Test Locally

```bash
# Add a document
curl -X POST http://127.0.0.1:3000/documents \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "description": "Local test"}'

# Search (requires actual DynamoDB tables)
curl "http://127.0.0.1:3000/search?q=test"
```

## Monitoring

### View Logs

```bash
sam logs -n IndexerFunction --tail
sam logs -n SearchFunction --tail
```

### CloudWatch Metrics

Monitor in the AWS Console:
- Lambda invocations and errors
- DynamoDB read/write capacity
- API Gateway requests and latency

## Cleanup

Delete all resources:

```bash
sam delete
```

Confirm the deletion when prompted. This removes:
- DynamoDB tables (including all data)
- Lambda functions
- API Gateway
- CloudWatch log groups
- IAM roles

## Customization

### Modify Searchable Fields

Edit both `src/indexer.ts` and `src/search.ts`:

```typescript
attributes: [
  { name: 'title', analyzer, shortName: 't' },
  { name: 'description', analyzer, shortName: 'd' },
  { name: 'tags', analyzer, shortName: 'tg' },  // Add new field
],
```

### Adjust Field Boosting

In `src/search.ts`:

```typescript
const results = await dynamosearch.search(query, {
  attributes: ['title^3', 'description'],  // Boost title 3x instead of 2x
  maxItems: 20,
});
```

### Change Memory/Timeout

In `template.yaml`:

```yaml
Globals:
  Function:
    MemorySize: 1024  # Increase for better performance
    Timeout: 60       # Increase for large documents
```

## Best Practices

1. **Use ARM64 architecture** - The template uses ARM64 for better price/performance
2. **External AWS SDK** - The build excludes `@aws-sdk/*` to reduce bundle size (Lambda runtime provides it)
3. **Environment variables** - Table names are passed via environment variables for flexibility
4. **Error handling** - SearchFunction includes try/catch for graceful error responses
5. **Logging** - Both functions log events for debugging

## Troubleshooting

### Indexer Not Processing Records

Check CloudWatch logs:
```bash
sam logs -n IndexerFunction --tail
```

Common issues:
- IAM permissions missing
- Stream not enabled on source table
- Lambda timeout too short

### Search Returns No Results

1. Verify documents were indexed:
   - Check CloudWatch logs for IndexerFunction
   - Query SearchIndexTable directly in AWS Console

2. Check analyzer compatibility:
   - Both indexer and search must use the same analyzer

3. Verify table name:
   - Ensure `INDEX_TABLE_NAME` environment variable is correct
