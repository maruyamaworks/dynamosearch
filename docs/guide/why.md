# Why DynamoSearch

DynamoSearch is a full-text search library for [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) that enables powerful search capabilities on your DynamoDB tables. It processes DynamoDB Streams to build and maintain a search index, implementing the BM25 scoring algorithm for relevance ranking.

## The Problems

DynamoDB is an excellent NoSQL database, but it lacks built-in full-text search capabilities. While you could use Amazon OpenSearch Service or Elasticsearch, these add significant cost and operational complexity to your infrastructure.

DynamoSearch solves this by:

- **Using only DynamoDB**: No additional services required
- **Stream-based updates**: Automatically indexes changes via DynamoDB Streams
- **BM25 ranking**: Industry-standard relevance scoring, also used by Elasticsearch
- **Flexible text analysis**: Pluggable analyzers for different languages and use cases
- **Cost-effective**: Pay only for DynamoDB operations
