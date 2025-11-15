# DynamoSearch

The main class for managing search indexes and performing searches.

## Constructor

```typescript
new DynamoSearch(options: Options)
```

Creates a new DynamoSearch instance.

### Parameters

- **options** (`Options`) - Configuration object
  - **indexTableName** (`string`) - Name of the search index table
  - **attributes** (`Attribute[]`) - Searchable attributes configuration
  - **keys** (`Key[]`) - Primary key structure from source table
  - **dynamoDBClientConfig** (`DynamoDBClientConfig`, optional) - AWS SDK DynamoDB client configuration

### Example

```typescript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';

const analyzer = await StandardAnalyzer.getInstance();

const dynamosearch = new DynamoSearch({
  indexTableName: 'my-search-index',
  attributes: [
    { name: 'title', analyzer, shortName: 't' },
    { name: 'body', analyzer, shortName: 'b' },
  ],
  keys: [
    { name: 'id', type: 'HASH' },
  ],
});
```

### Attribute Configuration

```typescript
interface Attribute {
  name: string;        // Field name in DynamoDB table
  analyzer: Analyzer;  // Text analyzer to use
  shortName?: string;  // Optional short name for storage optimization (recommended)
}
```

### Key Configuration

```typescript
interface Key {
  name: string;           // Key attribute name
  type: 'HASH' | 'RANGE'; // Key type
}
```

## createIndexTable()

```typescript
async createIndexTable(options?: CreateIndexTableOptions): Promise<void>
```

Creates the search index table with required structure and indexes.

### Parameters

- **options** (optional)
  - **ifNotExists** (`boolean`) - Skip creation if table exists (default: `false`)
  - **tableProperties** (`Partial<CreateTableCommandInput>`) - Custom table properties. You can specify the same parameters available in the DynamoDB [CreateTable](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html) API, such as `BillingMode`, `ProvisionedThroughput`, and `Tags`.

::: warning
Avoid calling `createIndexTable()` in your application logic on every requests. Creating tables involves API calls that add latency and may hit rate limits. Run `createIndexTable()` once during environment setup (e.g., deployment scripts, infrastructure provisioning).
:::

### Example

```typescript
// Basic creation
await dynamosearch.createIndexTable();

// Skip if exists
await dynamosearch.createIndexTable({ ifNotExists: true });

// With custom properties
await dynamosearch.createIndexTable({
  ifNotExists: true,
  tableProperties: {
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 5,
    },
    Tags: [
      { Key: 'Environment', Value: 'production' },
    ],
  },
});
```

## deleteIndexTable()

```typescript
async deleteIndexTable(options?: DeleteIndexTableOptions): Promise<void>
```

Deletes the search index table.

### Parameters

- **options** (optional)
  - **ifExists** (`boolean`) - Suppress error if table doesn't exist (default: `false`)

### Example

```typescript
// Delete table
await dynamosearch.deleteIndexTable();

// Suppress error if not exists
await dynamosearch.deleteIndexTable({ ifExists: true });
```

## processRecords()

```typescript
async processRecords(records: DynamoDBRecord[]): Promise<void>
```

Processes DynamoDB Stream records to maintain the search index.

### Parameters

- **records** (`DynamoDBRecord[]`) - Array of DynamoDB Stream records

::: tip
The source DynamoDB table must have Streams enabled with `StreamViewType` set to either `NEW_IMAGE` or `NEW_AND_OLD_IMAGES`. This ensures that the stream records contain the document data needed for indexing.
:::

### Example

```typescript
import type { DynamoDBStreamHandler } from 'aws-lambda';

export const handler: DynamoDBStreamHandler = async (event) => {
  await dynamosearch.processRecords(event.Records);
};
```

## search()

```typescript
async search(query: string, options?: SearchOptions): Promise<SearchResult>
```

Searches the index using BM25 ranking.

### Parameters

- **query** (`string`) - Search query text
- **options** (optional)
  - **attributes** (`string[]`) - Attributes to search with optional boost (e.g., `'title^2'`)
  - **maxItems** (`number`) - Maximum results to return (default: `100`)
  - **minScore** (`number`) - Minimum relevance score (default: `0`)
  - **bm25** (`BM25Params`) - BM25 parameters
    - **k1** (`number`) - Term frequency saturation (default: `1.2`)
    - **b** (`number`) - Length normalization (default: `0.75`)

### Returns

```typescript
interface SearchResult {
  items: SearchResultItem[];
  consumedCapacity: {
    capacityUnits: number;
    tableName: string;
  };
}

interface SearchResultItem {
  keys: Record<string, AttributeValue>;
  score: number;
}
```

### Examples

#### Basic Search

```typescript
const results = await dynamosearch.search('machine learning');

console.log(results.items);
// [
//   { keys: { id: { S: '1' } }, score: 4.523 },
//   { keys: { id: { S: '2' } }, score: 2.145 }
// ]
```

#### With Attribute Boosting

```typescript
const results = await dynamosearch.search('machine learning', {
  attributes: ['title^3', 'abstract^2', 'body'],
});
```

#### With Score Filtering

```typescript
const results = await dynamosearch.search('machine learning', {
  minScore: 1.0,
  maxItems: 10,
});
```

#### With Custom BM25 Parameters

```typescript
const results = await dynamosearch.search('machine learning', {
  bm25: {
    k1: 1.5,  // Higher k1: more weight to term frequency
    b: 0.9,   // Higher b: stronger length normalization
  },
});
```

#### Check Consumed Capacity

```typescript
const results = await dynamosearch.search('query');
console.log('Consumed capacity:', results.consumedCapacity.capacityUnits);
```

### Performance Notes

- Each unique token in the query generates one DynamoDB Query operation
- Consumed capacity scales with number of unique tokens × number of attributes searched
- Results are sorted in-memory after retrieval (top-k selection)

## reindex()

```typescript
async reindex(items: Record<string, AttributeValue>[]): Promise<void>
```

Reindexes existing documents. Useful for bulk indexing or index updates.

### Parameters

- **items** (`Record<string, AttributeValue>[]`) - Array of DynamoDB items

### Example

```typescript
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

// Scan all items
const { Items } = await client.send(new ScanCommand({
  TableName: 'articles',
}));

await dynamosearch.reindex(Items);
```

## getMetadata()

```typescript
async getMetadata(): Promise<Metadata>
```

Retrieves index metadata used for BM25 calculations.

### Returns

```typescript
interface Metadata {
  docCount: number;
  tokenCount: Map<string, number>;
}
```

### Example

```typescript
const metadata = await dynamosearch.getMetadata();

console.log('Total documents:', metadata.docCount);
console.log('Token counts:', metadata.tokenCount);
// Token counts: Map(2) {
//   'title' => 5432,
//   'body' => 123456
// }

// Calculate average document length
for (const [attr, totalTokens] of metadata.tokenCount) {
  const avgLength = totalTokens / metadata.docCount;
  console.log(`Average ${attr} length: ${avgLength.toFixed(2)} tokens`);
}
```

## Static Properties

### INDEX_KEYS

```typescript
static INDEX_KEYS: string = 'keys-index'
```

Name of the GSI used for document key lookups during deletion/updates.

### INDEX_HASH

```typescript
static INDEX_HASH: string = 'hash-index'
```

Name of the GSI used for efficient token queries (reserved for future use).

### ATTR_PK

```typescript
static ATTR_PK: string = 'p'
```

Partition key attribute name. Format: `{attributeName};{token}`

### ATTR_SK

```typescript
static ATTR_SK: string = 's'
```

Sort key attribute name. Binary data encoding occurrence count, document length, and key hash.

### ATTR_KEYS

```typescript
static ATTR_KEYS: string = 'k'
```

Document keys attribute name. Encoded representation of source table keys.

### ATTR_HASH

```typescript
static ATTR_HASH: string = 'h'
```

Key hash attribute name. First byte of MD5 hash of encoded keys (used in hash-index GSI).

### ATTR_META_DOCUMENT_COUNT

```typescript
static ATTR_META_DOCUMENT_COUNT: string = 'dc'
```

Metadata attribute for document count.

### ATTR_META_TOKEN_COUNT

```typescript
static ATTR_META_TOKEN_COUNT: string = 'tc'
```

Metadata attribute prefix for token counts. Full attribute names follow pattern `tc:{shortName}`.

## Instance Properties

### client

```typescript
client: DynamoDBClient
```

AWS SDK DynamoDB client instance.

### indexTableName

```typescript
indexTableName: string
```

Name of the search index table.

### attributes

```typescript
attributes: Attribute[]
```

Array of searchable attributes configuration.

### partitionKeyName

```typescript
partitionKeyName: string
```

Name of the partition key from source table.

### sortKeyName

```typescript
sortKeyName?: string
```

Name of the sort key from source table (if exists).
