# dynamosearch

Full-text search library for AWS DynamoDB with BM25 ranking.

## Installation

```bash
npm install dynamosearch
```

## Usage

### Basic Setup

```typescript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';

const analyzer = await StandardAnalyzer.getInstance();
const dynamosearch = new DynamoSearch({
  indexTableName: 'my-search-index',
  attributes: [
    { name: 'title', analyzer: analyzer },
    { name: 'description', analyzer: analyzer },
  ],
  keys: [
    { name: 'id', type: 'HASH' },
  ],
});

// Create index table
await dynamosearch.createIndexTable({ ifNotExists: true });
```

### Processing DynamoDB Streams

Use in AWS Lambda to automatically index data:

```typescript
import type { DynamoDBStreamHandler } from 'aws-lambda';

export const handler: DynamoDBStreamHandler = async (event) => {
  await dynamosearch.processRecords(event.Records);
};
```

### Searching

```typescript
const results = await dynamosearch.search('query text', {
  attributes: ['title^2', 'description'], // Boost title 2x
  maxItems: 20,
  minScore: 0.5,
});

// Results format:
// {
//   items: [
//     { keys: { id: { S: '123' } }, score: 4.5 },
//     ...
//   ],
//   consumedCapacity: { capacityUnits: 2.5, tableName: 'my-search-index' }
// }
```

## API Reference

### DynamoSearch

#### Methods

##### `createIndexTable(options?)`

Creates the search index table in DynamoDB.

```typescript
await dynamosearch.createIndexTable({ ifNotExists: true });
```

**Options:**
- `ifNotExists?: boolean` - Don't throw error if table already exists

##### `deleteIndexTable(options?)`

Deletes the search index table.

```typescript
await dynamosearch.deleteIndexTable({ ifExists: true });
```

**Options:**
- `ifExists?: boolean` - Don't throw error if table doesn't exist

##### `processRecords(records)`

Processes DynamoDB Stream records to maintain the index.

```typescript
await dynamosearch.processRecords(event.Records);
```

**Parameters:**
- `records: DynamoDBRecord[]` - Records from DynamoDB Streams

##### `search(query, options?)`

Executes a BM25-scored search query.

```typescript
const results = await dynamosearch.search('search terms', {
  attributes: ['title^2', 'body'],
  maxItems: 100,
  minScore: 0,
});
```

**Parameters:**
- `query: string` - Search query
- `options?: SearchOptions`
  - `attributes?: string[]` - Attributes to search (supports boost notation like `'title^2'`)
  - `maxItems?: number` - Maximum results (default: 100)
  - `minScore?: number` - Minimum relevance score (default: 0)
  - `bm25?: { k1?: number, b?: number }` - BM25 parameters (defaults: k1=1.2, b=0.75)

**Returns:**
```typescript
{
  items: Array<{
    keys: Record<string, AttributeValue>,
    score: number
  }>,
  consumedCapacity: {
    capacityUnits: number,
    tableName: string
  }
}
```

## Built-in Analyzers

### StandardAnalyzer

Word-based tokenization with lowercase normalization, suitable for English text.

```typescript
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';

const analyzer = await StandardAnalyzer.getInstance();
```

**Pipeline:**
- Tokenizer: `StandardTokenizer`
- Filters: `LowerCaseFilter`

### KeywordAnalyzer

Treats entire input as a single token for exact matching.

```typescript
import KeywordAnalyzer from 'dynamosearch/analyzers/KeywordAnalyzer.js';

const analyzer = await KeywordAnalyzer.getInstance();
```

**Pipeline:**
- Tokenizer: `KeywordTokenizer`
- Filters: `LowerCaseFilter`

## Text Analysis Components

### Tokenizers

- **StandardTokenizer** - Word-based tokenization (splits on whitespace and punctuation)
- **KeywordTokenizer** - No tokenization (entire input as one token)
- **NGramTokenizer** - N-gram tokenization with configurable min/max lengths
- **PathHierarchyTokenizer** - Tokenizes hierarchical paths (e.g., `/a/b/c` → `/a`, `/a/b`, `/a/b/c`)
- **IntlSegmenterTokenizer** - Uses `Intl.Segmenter` API for locale-aware segmentation

Usage:

```typescript
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer.js';
import NGramTokenizer from 'dynamosearch/tokenizers/NGramTokenizer.js';

const tokenizer = await StandardTokenizer.getInstance();
const ngramTokenizer = await NGramTokenizer.getInstance({ minGram: 2, maxGram: 3 });
```

### Token Filters

- **LowerCaseFilter** - Converts tokens to lowercase
- **CJKWidthFilter** - Normalizes CJK (Chinese, Japanese, Korean) character widths

Usage:

```typescript
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter.js';
import CJKWidthFilter from 'dynamosearch/filters/CJKWidthFilter.js';
```

### Character Filters

- **ICUNormalizer** - Unicode normalization (NFC, NFD, NFKC, NFKD)

Usage:

```typescript
import ICUNormalizer from 'dynamosearch/char_filters/ICUNormalizer.js';

const filter = ICUNormalizer({ name: 'nfkc' });
```

## Creating Custom Analyzers

Combine components to create custom text analysis pipelines:

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer.js';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer.js';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter.js';
import ICUNormalizer from 'dynamosearch/char_filters/ICUNormalizer.js';

class CustomAnalyzer extends Analyzer {
  static async getInstance() {
    return new CustomAnalyzer({
      charFilters: [ICUNormalizer({ name: 'nfkc' })],
      tokenizer: await StandardTokenizer.getInstance(),
      filters: [LowerCaseFilter()],
    });
  }
}

const analyzer = await CustomAnalyzer.getInstance();
```

## BM25 Scoring

DynamoSearch uses the BM25 algorithm for relevance ranking:

```
score = IDF(term) × (TF(term) × (k1 + 1)) / (TF(term) + k1 × (1 - b + b × (fieldLength / avgFieldLength)))
```

**Parameters:**
- `k1` (default: 1.2) - Controls term frequency saturation. Higher values increase the impact of term frequency.
- `b` (default: 0.75) - Controls field length normalization. 0 = no normalization, 1 = full normalization.

**Per-attribute boosting:**

```typescript
const results = await dynamosearch.search('query', {
  attributes: ['title^3', 'description^1.5', 'body'],
});
```

## Index Table Schema

The index table uses the following schema:

**Primary Key:**
- `token` (HASH) - Format: `{attributeName}/{tokenText}`
- `tfkeys` (RANGE) - Format: JSON array `[occurrenceHex, tokenCountHex, ...keys]`

**Attributes:**
- `keys` - JSON array of document primary keys
- `hash` - MD5 hash of keys for deduplication

**Indexes:**
- GSI `keys-index` - For efficient deletion by document keys
- LSI `hash-index` - For deduplication

**Metadata:**
- Special record with `token: '#metadata'` stores document count and per-attribute token counts

## Requirements

- Node.js 18+
- AWS SDK for JavaScript v3
- DynamoDB Streams enabled on source table

## Testing

DynamoDB Local is required for tests:

```bash
# Start DynamoDB Local on http://localhost:8000
docker run -p 8000:8000 amazon/dynamodb-local

# Run tests
pnpm test
```

## License

MIT
