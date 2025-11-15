# Getting Started

This guide will help you install and configure DynamoSearch for your project.

## Requirements

- Node.js 20+

## Installation

Install DynamoSearch using npm, yarn, or pnpm:

::: code-group

```bash [npm]
npm install dynamosearch
```

```bash [yarn]
yarn add dynamosearch
```

```bash [pnpm]
pnpm add dynamosearch
```

:::

For Japanese text analysis, also install the kuromoji plugin:

::: code-group

```bash [npm]
npm install @dynamosearch/plugin-analysis-kuromoji
```

```bash [yarn]
yarn add @dynamosearch/plugin-analysis-kuromoji
```

```bash [pnpm]
pnpm add @dynamosearch/plugin-analysis-kuromoji
```

:::

## Step 1: Create a DynamoDB Table with Streams

Your source table needs DynamoDB Streams enabled:

::: code-group

```bash [AWS CLI]
aws dynamodb create-table \
  --table-name articles \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES
```

```typescript [AWS SDK for JavaScript]
import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});
await client.send(new CreateTableCommand({
  TableName: 'articles',
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
  ],
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },
  ],
  BillingMode: 'PAY_PER_REQUEST',
  StreamSpecification: {
    StreamEnabled: true,
    StreamViewType: 'NEW_AND_OLD_IMAGES',
  },
}));
```

:::

::: warning IMPORTANT
The `StreamViewType` of the stream MUST be either `NEW_IMAGE` or `NEW_AND_OLD_IMAGES`.
:::

## Step 2: Initialize DynamoSearch

In your application code, initialize a DynamoSearch instance:

```typescript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';

// Create an analyzer
const analyzer = await StandardAnalyzer.getInstance();

// Initialize DynamoSearch
const dynamosearch = new DynamoSearch({
  /**
   * Name of the table to store the inverted index for full-text search.
   * This table will be created in the next step.
   */
  indexTableName: 'articles-index',

  /**
   * Attributes of the source table to be indexed for full-text search.
   * Specify the attribute name and the analyzer to use for each attribute.
   * Short names are optional but highly recommended to save your costs.
   */
  attributes: [
    { name: 'title', analyzer, shortName: 't' },
    { name: 'content', analyzer, shortName: 'c' },
  ],

  /**
   * Primary key configuration of the source table.
   * Specify in the same format as KeySchema in DynamoDB CreateTable API.
   */
  keys: [
    { name: 'id', type: 'HASH' },
  ],
});
```

If you're indexing Japanese text, we recommend using `KuromojiAnalyzer` from `@dynamosearch/plugin-analysis-kuromoji` instead of `StandardAnalyzer` for better tokenization and search accuracy.

```typescript
import DynamoSearch from 'dynamosearch';
import KuromojiAnalyzer from '@dynamosearch/plugin-analysis-kuromoji/analyzers/KuromojiAnalyzer.js';

// Create an analyzer
const analyzer = await KuromojiAnalyzer.getInstance();

// Initialize DynamoSearch
const dynamosearch = new DynamoSearch({ /* ... */ });
```

## Step 3: Create the Index Table

DynamoSearch can automatically create the index table:

```typescript
await dynamosearch.createIndexTable({ ifNotExists: true });
```

Alternatively, you can create the index table manually using the AWS CLI or AWS SDK:

::: code-group

```bash [AWS CLI]
aws dynamodb create-table \
  --table-name articles-index \
  --attribute-definitions AttributeName=p,AttributeType=S AttributeName=s,AttributeType=B AttributeName=k,AttributeType=S AttributeName=h,AttributeType=B \
  --key-schema AttributeName=p,KeyType=HASH AttributeName=s,KeyType=RANGE \
  --global-secondary-indexes "IndexName=keys-index,KeySchema=[{AttributeName=k,KeyType=HASH}],Projection={ProjectionType=KEYS_ONLY}" "IndexName=hash-index,KeySchema=[{AttributeName=p,KeyType=HASH},{AttributeName=h,KeyType=RANGE}],Projection={ProjectionType=KEYS_ONLY}" \
  --billing-mode PAY_PER_REQUEST
```

```typescript [AWS SDK for JavaScript]
import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});
await client.send(new CreateTableCommand({
  TableName: 'articles-index',
  AttributeDefinitions: [
    { AttributeName: 'p', AttributeType: 'S' },
    { AttributeName: 's', AttributeType: 'B' },
    { AttributeName: 'k', AttributeType: 'S' },
    { AttributeName: 'h', AttributeType: 'B' },
  ],
  KeySchema: [
    { AttributeName: 'p', KeyType: 'HASH' },
    { AttributeName: 's', KeyType: 'RANGE' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'keys-index',
      KeySchema: [
        { AttributeName: 'k', KeyType: 'HASH' },
      ],
      Projection: { ProjectionType: 'KEYS_ONLY' },
    },
    {
      IndexName: 'hash-index',
      KeySchema: [
        { AttributeName: 'p', KeyType: 'HASH' },
        { AttributeName: 'h', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'KEYS_ONLY' },
    },
  ],
  BillingMode: 'PAY_PER_REQUEST',
}));

```

:::

The index table has the following structure:
- Primary key: `p` (partition key, string), `s` (sort key, binary)
- GSI: `keys-index` for document lookup
- GSI: `hash-index` for estimating the total number of matched documents

::: tip
The short attribute names (like `p`, `s`, `k`, `h`) may seem cryptic, but this is an intentional design to minimize your storage costs and RCU/RRU consumption. Since index tables tend to have a very large number of records, the length of attribute names can significantly impact costs.
:::

## Step 4: Deploy a Lambda Function to Process DynamoDB Streams

Create a Lambda function that processes DynamoDB Stream events and updates the search index:

```javascript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';

const analyzer = await StandardAnalyzer.getInstance();
const dynamosearch = new DynamoSearch({
  indexTableName: 'articles-index',
  attributes: [
    { name: 'title', analyzer, shortName: 't' },
    { name: 'content', analyzer, shortName: 'd' },
  ],
  keys: [
    { name: 'id', type: 'HASH' },
  ],
});

export const handler = async (event) => {
  await dynamosearch.processRecords(event.Records);
};
```

Deploy the function and configure it as a trigger for your DynamoDB Stream. The Lambda function needs IAM permissions to read from the stream and write to the index table.

::: info
For detailed deployment instructions and AWS SAM/CDK examples, see the [AWS Lambda Integration](/guide/lambda-integration) guide.
:::

## Step 5: Add Documents to Your Source Table

Add some documents to your source table. The Lambda function will automatically process the stream events and update the search index:

::: code-group

```bash [AWS CLI]
aws dynamodb batch-write-item \
  --request-items '{
    "articles": [
      {
        "PutRequest": {
          "Item": {
            "id": { "S": "1" },
            "title": { "S": "Introduction to Machine Learning" },
            "content": { "S": "Machine learning is a subset of artificial intelligence..." }
          }
        }
      },
      {
        "PutRequest": {
          "Item": {
            "id": { "S": "2" },
            "title": { "S": "Deep Learning Basics" },
            "content": { "S": "Deep learning uses neural networks with multiple layers..." }
          }
        }
      },
      {
        "PutRequest": {
          "Item": {
            "id": { "S": "1" },
            "title": { "S": "Natural Language Processing" },
            "content": { "S": "NLP enables computers to understand human language..." }
          }
        }
      }
    ]
  }'
```

```typescript [AWS SDK for JavaScript]
import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});
await client.send(new BatchWriteItemCommand({
  RequestItems: {
    articles: [
      {
        PutRequest: {
          Item: {
            id: { S: '1' },
            title: { S: 'Introduction to Machine Learning' },
            content: { S: 'Machine learning is a subset of artificial intelligence...' },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            id: { S: '2' },
            title: { S: 'Deep Learning Basics' },
            content: { S: 'Deep learning uses neural networks with multiple layers...' },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            id: { S: '3' },
            title: { S: 'Natural Language Processing' },
            content: { S: 'NLP enables computers to understand human language...' },
          },
        },
      },
    ],
  },
}));
```

:::

## Step 6: Search Your Documents

Now you can perform full-text searches against your documents:

```typescript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';

const analyzer = await StandardAnalyzer.getInstance();
const dynamosearch = new DynamoSearch({
  indexTableName: 'articles-index',
  attributes: [
    { name: 'title', analyzer, shortName: 't' },
    { name: 'content', analyzer, shortName: 'd' },
  ],
  keys: [
    { name: 'id', type: 'HASH' },
  ],
});

// Search for documents containing "machine learning"
const results = await dynamosearch.search('machine learning', {
  attributes: ['title^2', 'content'], // Boost title 2x
  maxItems: 10,
});

console.log('Search Results:');
console.log(JSON.stringify(results.items, null, 2));
// [
//   {
//     keys: { id: { S: '1' } },
//     score: 4.523
//   },
//   {
//     keys: { id: { S: '2' } },
//     score: 2.145
//   }
// ]
```

The search results include:
- `items`: Array of matching documents with their BM25 scores
- `consumedCapacity`: DynamoDB capacity units consumed by the search operation

::: info
For more advanced search features like field boosting and filters, see the [API Reference](/reference/).
:::

## Step 7 (Optional): Retrieve Full Documents

DynamoSearch returns only document keys and scores. To get the full document content, fetch from your source table using the returned keys:

```typescript
import { DynamoDBClient, BatchGetItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});
const response = await client.send(new BatchGetItemCommand({
  RequestItems: {
    articles: {
      // Use the keys from search results
      Keys: results.items.map(item => item.keys),
    },
  },
}));

const articles = response.Responses?.articles ?? [];
console.log('Full Documents:');
articles.forEach((article) => {
  console.log({
    id: article.id.S,
    title: article.title.S,
    content: article.content.S,
  });
});
```

## DynamoDB Client Configuration

DynamoSearch uses the AWS SDK v3 DynamoDB client. You can configure it using environment variables:

```bash
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
```

Or use IAM roles when running on AWS Lambda, EC2, or ECS.

## Required IAM Permissions

Your application needs the following IAM permissions to use DynamoSearch:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/articles-index"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/articles-index",
        "arn:aws:dynamodb:*:*:table/articles-index/index/keys-index",
        "arn:aws:dynamodb:*:*:table/articles-index/index/hash-index"
      ]
    }
  ]
}
```

For Lambda functions processing DynamoDB Streams, also add:

```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetRecords",
    "dynamodb:GetShardIterator",
    "dynamodb:DescribeStream",
    "dynamodb:ListStreams"
  ],
  "Resource": "arn:aws:dynamodb:*:*:table/articles/stream/*"
}
```
