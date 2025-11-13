# Index Management

Learn how to create, manage, and optimize your DynamoSearch indexes.

## Index Table Structure

The search index table has a specialized structure optimized for BM25 ranking:

```typescript
{
  TableName: 'search-index',
  AttributeDefinitions: [
    { AttributeName: 'p', AttributeType: 'S' },  // Partition key
    { AttributeName: 's', AttributeType: 'B' },  // Sort key
    { AttributeName: 'k', AttributeType: 'S' },  // Document keys
    { AttributeName: 'h', AttributeType: 'B' }   // Key hash
  ],
  KeySchema: [
    { AttributeName: 'p', KeyType: 'HASH' },
    { AttributeName: 's', KeyType: 'RANGE' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'keys-index',
      KeySchema: [{ AttributeName: 'k', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'KEYS_ONLY' }
    },
    {
      IndexName: 'hash-index',
      KeySchema: [
        { AttributeName: 'p', KeyType: 'HASH' },
        { AttributeName: 'h', KeyType: 'RANGE' }
      ],
      Projection: { ProjectionType: 'KEYS_ONLY' }
    }
  ]
}
```

### Partition Key (p)

Format: `{attributeName};{token}`

Example: `title;machine`

This allows efficient lookups for specific terms in specific fields.

### Sort Key (s)

Binary data (14 bytes) encoding:
- Bytes 0-1: Occurrence count (16-bit unsigned integer)
- Bytes 2-5: Document length in tokens (32-bit unsigned integer)
- Bytes 6-13: MD5 hash of document keys (first 8 bytes)

This enables sorting by occurrence count for efficient retrieval of most relevant documents.

### Document Keys (k)

Encoded representation of the document's primary key from the source table.

### Key Hash (h)

First byte of the MD5 hash, used for the hash-index GSI.

## Creating the Index

### Automatic Creation

```typescript
await dynamosearch.createIndexTable({ ifNotExists: true });
```

Options:
- `ifNotExists`: Skip creation if table already exists

### With Custom Table Properties

```typescript
await dynamosearch.createIndexTable({
  ifNotExists: true,
  tableProperties: {
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    Tags: [
      { Key: 'Environment', Value: 'production' }
    ]
  }
});
```

## Deleting the Index

```typescript
await dynamosearch.deleteIndexTable({ ifExists: true });
```

Options:
- `ifExists`: Suppress error if table doesn't exist

## Reindexing

Reindex existing documents when you:
- Add new searchable attributes
- Change analyzers
- Fix indexing issues

### Full Reindex

```typescript
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

// Scan all items from source table
let items = [];
let exclusiveStartKey = undefined;

do {
  const { Items, LastEvaluatedKey } = await client.send(new ScanCommand({
    TableName: 'articles',
    ExclusiveStartKey: exclusiveStartKey
  }));

  if (Items) items.push(...Items);
  exclusiveStartKey = LastEvaluatedKey;
} while (exclusiveStartKey);

// Reindex in batches
const BATCH_SIZE = 25;
for (let i = 0; i < items.length; i += BATCH_SIZE) {
  await dynamosearch.reindex(items.slice(i, i + BATCH_SIZE));
  console.log(`Reindexed ${Math.min(i + BATCH_SIZE, items.length)}/${items.length}`);
}
```

### Partial Reindex

Reindex specific items:

```typescript
import { QueryCommand } from '@aws-sdk/client-dynamodb';

// Query items to reindex
const { Items } = await client.send(new QueryCommand({
  TableName: 'articles',
  KeyConditionExpression: 'category = :category',
  ExpressionAttributeValues: {
    ':category': { S: 'technology' }
  }
}));

await dynamosearch.reindex(Items);
```

## Metadata

DynamoSearch maintains metadata for BM25 calculations:

```typescript
const metadata = await dynamosearch.getMetadata();

console.log('Total documents:', metadata.docCount);
console.log('Token counts:', metadata.tokenCount);
// Token counts: Map {
//   'title' => 1234,
//   'body' => 56789
// }
```

Metadata is stored in a special item with key:
```typescript
{
  p: { S: '_' },
  s: { B: new Uint8Array([0]) }
}
```

## Storage Optimization

### Use Short Attribute Names

Reduce storage costs by using short names:

```typescript
const dynamosearch = new DynamoSearch({
  indexTableName: 'search-index',
  attributes: [
    { name: 'title', shortName: 't', analyzer },
    { name: 'body', shortName: 'b', analyzer },
    { name: 'description', shortName: 'd', analyzer }
  ],
  keys: [{ name: 'id', type: 'HASH' }]
});
```

Short names are used in the partition key:
- Without: `description;machine` (19 bytes)
- With: `d;machine` (9 bytes)

### Selective Indexing

Only index fields that need to be searchable:

```typescript
// ❌ Index everything
const dynamosearch = new DynamoSearch({
  attributes: [
    { name: 'title', analyzer },
    { name: 'body', analyzer },
    { name: 'metadata', analyzer },  // Not searchable, wastes space
    { name: 'tags', analyzer },
    { name: 'internalNotes', analyzer }  // Not searchable, wastes space
  ]
});

// ✅ Index only searchable fields
const dynamosearch = new DynamoSearch({
  attributes: [
    { name: 'title', analyzer },
    { name: 'body', analyzer },
    { name: 'tags', analyzer }
  ]
});
```

## Cost Management

### On-Demand vs Provisioned

**On-Demand** (default):
```typescript
await dynamosearch.createIndexTable({
  tableProperties: { BillingMode: 'PAY_PER_REQUEST' }
});
```
- Pay per request
- Good for unpredictable workloads
- No capacity planning needed

**Provisioned**:
```typescript
await dynamosearch.createIndexTable({
  tableProperties: {
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
});
```
- Lower cost for consistent workloads
- Requires capacity planning
- Can use auto-scaling

### Monitor Consumed Capacity

Track capacity usage:

```typescript
const results = await dynamosearch.search('query', {
  attributes: ['title', 'body']
});

console.log('Capacity units consumed:', results.consumedCapacity.capacityUnits);
console.log('Table:', results.consumedCapacity.tableName);
```

### Reduce Search Costs

1. **Search fewer attributes:**
```typescript
// More expensive
const results = await dynamosearch.search('query', {
  attributes: ['title', 'body', 'tags', 'description']
});

// Less expensive
const results = await dynamosearch.search('query', {
  attributes: ['title']
});
```

2. **Use minScore to reduce result processing:**
```typescript
const results = await dynamosearch.search('query', {
  minScore: 1.0  // Skip low-relevance results
});
```

## Monitoring

### CloudWatch Metrics

Monitor DynamoDB metrics:
- `ConsumedReadCapacityUnits`
- `ConsumedWriteCapacityUnits`
- `ThrottledRequests`
- `SystemErrors`

### Custom Logging

Log search performance:

```typescript
const startTime = Date.now();
const results = await dynamosearch.search('query');
const duration = Date.now() - startTime;

console.log({
  query: 'query',
  resultCount: results.items.length,
  durationMs: duration,
  consumedCapacity: results.consumedCapacity.capacityUnits
});
```

## Best Practices

1. **Create indexes in dev/staging first** - Test before production
2. **Use short attribute names** - Reduce storage costs
3. **Index only searchable fields** - Don't waste space
4. **Monitor capacity** - Track usage to optimize costs
5. **Reindex during off-peak hours** - Reduce impact on production
6. **Use batching for reindex** - Process in manageable chunks
7. **Test with production data size** - Ensure performance at scale
