# DynamoSearch

A full-text search library for AWS DynamoDB with BM25 ranking and pluggable text analysis.

## Overview

DynamoSearch enables full-text search on DynamoDB tables by processing DynamoDB Streams to build and maintain a search index. It implements BM25 scoring for relevance ranking and provides a flexible text analysis pipeline inspired by Elasticsearch.

## Features

- **BM25 Scoring**: Industry-standard relevance ranking algorithm
- **Stream-Based Indexing**: Automatically maintains search index from DynamoDB Streams
- **Pluggable Analysis**: Character filters, tokenizers, and token filters
- **Multi-Language Support**: Built-in analyzers for English and Japanese (via plugin)
- **Per-Attribute Boosting**: Weight specific fields higher in search results
- **Serverless-Friendly**: Works seamlessly with AWS Lambda

## Installation

```bash
npm install dynamosearch
```

For Japanese text analysis:

```bash
npm install dynamosearch @dynamosearch/plugin-analysis-kuromoji
```

## Quick Start

```typescript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';

// Initialize the search instance
const analyzer = await StandardAnalyzer.getInstance();
const dynamosearch = new DynamoSearch({
  indexTableName: 'my-search-index',
  attributes: [
    { name: 'title', analyzer: analyzer },
    { name: 'body', analyzer: analyzer },
  ],
  keys: [
    { name: 'id', type: 'HASH' },
  ],
});

// Create the index table
await dynamosearch.createIndexTable({ ifNotExists: true });

// Process DynamoDB Stream records (typically in a Lambda function)
await dynamosearch.processRecords(records);

// Search
const results = await dynamosearch.search('hello world', {
  attributes: ['title^2', 'body'], // Boost title 2x
  maxItems: 20,
  minScore: 0.5,
});

console.log(results.items);
// [
//   { keys: { id: { S: '123' } }, score: 4.5 },
//   { keys: { id: { S: '456' } }, score: 3.2 },
// ]
```

## Lambda Integration

```typescript
import type { DynamoDBStreamHandler } from 'aws-lambda';

export const handler: DynamoDBStreamHandler = async (event) => {
  await dynamosearch.processRecords(event.Records);
};
```

## Packages

- **[dynamosearch](./packages/dynamosearch/)** - Core search library
- **[@dynamosearch/plugin-analysis-kuromoji](./packages/plugin-analysis-kuromoji/)** - Japanese text analysis plugin

## Documentation

### Built-in Analyzers

- `StandardAnalyzer` - Word-based tokenization with lowercase normalization (English)
- `KeywordAnalyzer` - Treats entire input as a single token (exact matching)

### Custom Analyzers

Create custom analyzers by composing character filters, tokenizers, and token filters:

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer.js';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer.js';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter.js';

class MyAnalyzer extends Analyzer {
  static async getInstance() {
    return new MyAnalyzer({
      charFilters: [],
      tokenizer: await StandardTokenizer.getInstance(),
      filters: [LowerCaseFilter()],
    });
  }
}
```

### Search Options

```typescript
interface SearchOptions {
  attributes?: string[];  // Attributes to search with optional boost (e.g., 'title^2')
  maxItems?: number;      // Maximum results to return (default: 100)
  minScore?: number;      // Minimum relevance score (default: 0)
  bm25?: {
    k1?: number;          // Term frequency saturation (default: 1.2)
    b?: number;           // Length normalization (default: 0.75)
  };
}
```

## Requirements

- Node.js 18+
- AWS DynamoDB
- DynamoDB Streams enabled on source table

## License

MIT

## Contributing

Contributions welcome! Please see individual package READMEs for development setup.
