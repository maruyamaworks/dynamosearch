# DynamoSearch SAM Example

This example demonstrates how to deploy a full-text search application using DynamoSearch with AWS SAM.

## Architecture

- **DocumentsTable**: DynamoDB table to store documents with DynamoDB Streams enabled
- **SearchIndexTable**: DynamoDB table to store the search index
- **IndexerFunction**: Lambda function that processes DynamoDB Stream records and updates the search index
- **SearchFunction**: Lambda function that handles search API requests
- **AddDocumentFunction**: Lambda function that adds new documents to the DocumentsTable

## Prerequisites

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- [Node.js 20+](https://nodejs.org/)
- AWS credentials configured

## Deployment

1. Install dependencies:

```bash
npm install
```

2. Deploy the stack:

```bash
sam build
sam deploy --guided
```

During the guided deployment, provide:
- Stack name (e.g., `dynamosearch-example`)
- AWS Region
- Confirm the parameters

3. Note the API URLs from the outputs:
- `AddDocumentUrl`: POST endpoint to add documents
- `SearchUrl`: GET endpoint to search documents

## Usage

### Add a document

```bash
curl -X POST https://<api-id>.execute-api.<region>.amazonaws.com/Prod/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hello World",
    "description": "This is a sample document for testing DynamoSearch."
  }'
```

### Search documents

```bash
curl "https://<api-id>.execute-api.<region>.amazonaws.com/Prod/search?q=hello"
```

### Add multiple documents

```bash
# Document 1
curl -X POST https://<api-id>.execute-api.<region>.amazonaws.com/Prod/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to AWS Lambda",
    "description": "AWS Lambda is a serverless compute service that runs your code in response to events."
  }'

# Document 2
curl -X POST https://<api-id>.execute-api.<region>.amazonaws.com/Prod/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with DynamoDB",
    "description": "Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance."
  }'

# Document 3
curl -X POST https://<api-id>.execute-api.<region>.amazonaws.com/Prod/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Serverless Architecture",
    "description": "Serverless computing allows you to build and run applications without managing servers."
  }'
```

### Search examples

```bash
# Search for "lambda"
curl "https://<api-id>.execute-api.<region>.amazonaws.com/Prod/search?q=lambda"

# Search for "dynamodb"
curl "https://<api-id>.execute-api.<region>.amazonaws.com/Prod/search?q=dynamodb"

# Search for "serverless"
curl "https://<api-id>.execute-api.<region>.amazonaws.com/Prod/search?q=serverless"
```

## Clean up

To delete the stack and all resources:

```bash
sam delete
```

## Configuration

The search configuration is defined in the Lambda functions:

- **Searchable attributes**: `title` and `description`
- **Boosting**: Title is boosted 2x (`title^2`)
- **Maximum results**: 20

You can modify these settings in `src/indexer.ts` and `src/search.ts`.

## Development

### Local testing

You can test the Lambda functions locally using SAM CLI:

```bash
sam local start-api
```

## License

MIT
