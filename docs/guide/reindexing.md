# Reindexing

Learn how to reindex your documents when you need to rebuild or update your search index.

## When to Reindex

You need to reindex when:

- **Adding new fields** - Make existing fields searchable
- **Changing analyzers** - Apply different text analysis
- **Fixing data issues** - Correct indexing problems
- **Migrating schemas** - Update key structure
- **Initial indexing** - Index existing data for the first time

## Full Reindex

Reindex all documents in your table.

### Basic Full Reindex

```typescript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

const analyzer = new StandardAnalyzer();
const dynamosearch = new DynamoSearch({
  indexTableName: 'articles-index',
  fields: [
    { name: 'title', analyzer },
    { name: 'content', analyzer },
  ],
  keySchema: [{ name: 'id', type: 'HASH' }],
});

// Scan all items
let indexedCount = 0;
let exclusiveStartKey = undefined;

do {
  const { Items, LastEvaluatedKey } = await client.send(new ScanCommand({
    TableName: 'articles',
    ExclusiveStartKey: exclusiveStartKey,
  }));
  if (Items) {
    await dynamosearch.reindex(Items);
    indexedCount += Items.length;
  }
  exclusiveStartKey = LastEvaluatedKey;
} while (exclusiveStartKey);

console.log(`Reindexed ${indexedCount} items`);
```

## Zero-Downtime Reindex

Reindex without disrupting search service.

```typescript
// Write to both indexes during migration
const oldIndex = new DynamoSearch({ indexTableName: 'search-index', ... });
const newIndex = new DynamoSearch({ indexTableName: 'search-index-v2', ... });

export const handler: DynamoDBStreamHandler = async (event) => {
  // Write to both indexes
  await Promise.all([
    oldIndex.processRecords(event.Records),
    newIndex.processRecords(event.Records)
  ]);
};

// After backfill complete, switch to new index only
```
