# Reindexing

Learn how to reindex your documents when you need to rebuild or update your search index.

## When to Reindex

You need to reindex when:

- **Adding new attributes** - Make existing fields searchable
- **Changing analyzers** - Apply different text analysis
- **Fixing data issues** - Correct indexing problems
- **Migrating schemas** - Update key structure
- **Initial indexing** - Index existing data for the first time

## Full Reindex

Reindex all documents in your table.

### Basic Full Reindex

```typescript
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';

const client = new DynamoDBClient({});
const analyzer = await StandardAnalyzer.getInstance();
const dynamosearch = new DynamoSearch({
  indexTableName: 'search-index',
  attributes: [
    { name: 'title', analyzer },
    { name: 'body', analyzer }
  ],
  keys: [{ name: 'id', type: 'HASH' }]
});

// Scan all items
let items: Record<string, AttributeValue>[] = [];
let exclusiveStartKey = undefined;

do {
  const { Items, LastEvaluatedKey } = await client.send(new ScanCommand({
    TableName: 'articles',
    ExclusiveStartKey: exclusiveStartKey
  }));

  if (Items) items.push(...Items);
  exclusiveStartKey = LastEvaluatedKey;
} while (exclusiveStartKey);

console.log(`Found ${items.length} items to reindex`);

// Reindex in batches
const BATCH_SIZE = 25;
for (let i = 0; i < items.length; i += BATCH_SIZE) {
  const batch = items.slice(i, i + BATCH_SIZE);
  await dynamosearch.reindex(batch);
  console.log(`Reindexed ${Math.min(i + BATCH_SIZE, items.length)}/${items.length}`);
}

console.log('Reindex complete!');
```

### With Progress Tracking

```typescript
import { ProgressBar } from 'some-progress-library';

const bar = new ProgressBar(':bar :current/:total (:percent) :etas', {
  total: items.length,
  width: 40
});

for (let i = 0; i < items.length; i += BATCH_SIZE) {
  const batch = items.slice(i, i + BATCH_SIZE);
  await dynamosearch.reindex(batch);
  bar.tick(batch.length);
}
```

## Partial Reindex

Reindex specific documents based on criteria.

### By Query

```typescript
import { QueryCommand } from '@aws-sdk/client-dynamodb';

// Reindex all articles in a category
const { Items } = await client.send(new QueryCommand({
  TableName: 'articles',
  IndexName: 'category-index',
  KeyConditionExpression: 'category = :category',
  ExpressionAttributeValues: {
    ':category': { S: 'technology' }
  }
}));

if (Items) {
  await dynamosearch.reindex(Items);
  console.log(`Reindexed ${Items.length} technology articles`);
}
```

### By Date Range

```typescript
const { Items } = await client.send(new QueryCommand({
  TableName: 'articles',
  KeyConditionExpression: '#pk = :pk AND #timestamp BETWEEN :start AND :end',
  ExpressionAttributeNames: {
    '#pk': 'userId',
    '#timestamp': 'createdAt'
  },
  ExpressionAttributeValues: {
    ':pk': { S: 'user-123' },
    ':start': { N: '1609459200000' },  // 2021-01-01
    ':end': { N: '1640995200000' }     // 2022-01-01
  }
}));

if (Items) {
  await dynamosearch.reindex(Items);
}
```

### By Filter

```typescript
const { Items } = await client.send(new ScanCommand({
  TableName: 'articles',
  FilterExpression: 'attribute_exists(needsReindex)',
  ProjectionExpression: 'id, title, body'
}));

if (Items) {
  await dynamosearch.reindex(Items);
}
```

## Incremental Reindex

Process large datasets in smaller chunks to avoid timeouts and memory issues.

```typescript
async function incrementalReindex(
  tableName: string,
  batchSize: number = 25,
  delayMs: number = 100
) {
  let exclusiveStartKey = undefined;
  let totalProcessed = 0;

  do {
    // Scan a batch
    const { Items, LastEvaluatedKey } = await client.send(new ScanCommand({
      TableName: tableName,
      Limit: batchSize,
      ExclusiveStartKey: exclusiveStartKey
    }));

    // Reindex the batch
    if (Items && Items.length > 0) {
      await dynamosearch.reindex(Items);
      totalProcessed += Items.length;
      console.log(`Processed ${totalProcessed} items`);
    }

    exclusiveStartKey = LastEvaluatedKey;

    // Rate limiting
    if (exclusiveStartKey) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  } while (exclusiveStartKey);

  return totalProcessed;
}

const total = await incrementalReindex('articles', 25, 100);
console.log(`Reindex complete: ${total} items processed`);
```

## Parallel Reindex

Speed up reindexing using parallel processing.

```typescript
async function parallelReindex(items: any[], concurrency: number = 5) {
  const BATCH_SIZE = 25;
  const batches: any[][] = [];

  // Split into batches
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }

  // Process batches in parallel with concurrency limit
  for (let i = 0; i < batches.length; i += concurrency) {
    const chunk = batches.slice(i, i + concurrency);
    await Promise.all(chunk.map(batch => dynamosearch.reindex(batch)));
    console.log(`Processed ${Math.min(i + concurrency, batches.length)}/${batches.length} batches`);
  }
}

await parallelReindex(items, 5);
```

## Zero-Downtime Reindex

Reindex without disrupting search service.

### Strategy 1: Blue-Green Index

```typescript
// 1. Create new index table
const newIndexName = 'search-index-v2';
const dynamosearchNew = new DynamoSearch({
  indexTableName: newIndexName,
  attributes: [
    { name: 'title', analyzer: newAnalyzer },
    { name: 'body', analyzer: newAnalyzer }
  ],
  keys: [{ name: 'id', type: 'HASH' }]
});

await dynamosearchNew.createIndexTable();

// 2. Reindex into new table
await incrementalReindex('articles', dynamosearchNew);

// 3. Switch search to new index (update environment variable)
process.env.INDEX_TABLE_NAME = newIndexName;

// 4. Delete old index (after validation)
const dynamosearchOld = new DynamoSearch({
  indexTableName: 'search-index',
  attributes: [...],
  keys: [...]
});
await dynamosearchOld.deleteIndexTable();
```

### Strategy 2: Dual-Write

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

## Handling Errors

### Retry Failed Batches

```typescript
async function reindexWithRetry(
  items: any[],
  maxRetries: number = 3
) {
  const BATCH_SIZE = 25;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        await dynamosearch.reindex(batch);
        break;
      } catch (error) {
        attempts++;
        console.error(`Batch ${i}-${i + BATCH_SIZE} failed (attempt ${attempts}):`, error);

        if (attempts >= maxRetries) {
          console.error('Max retries reached, saving failed batch');
          // Save to DLQ or file for manual processing
          await saveFailed batch(batch);
        } else {
          // Exponential backoff
          await new Promise(resolve =>
            setTimeout(resolve, Math.pow(2, attempts) * 1000)
          );
        }
      }
    }
  }
}
```

### Resume from Checkpoint

```typescript
import { readFileSync, writeFileSync } from 'fs';

async function reindexWithCheckpoint(
  tableName: string,
  checkpointFile: string = 'reindex-checkpoint.json'
) {
  // Load checkpoint
  let checkpoint = null;
  try {
    checkpoint = JSON.parse(readFileSync(checkpointFile, 'utf-8'));
  } catch {
    console.log('No checkpoint found, starting from beginning');
  }

  let exclusiveStartKey = checkpoint?.exclusiveStartKey;
  let totalProcessed = checkpoint?.totalProcessed || 0;

  do {
    const { Items, LastEvaluatedKey } = await client.send(new ScanCommand({
      TableName: tableName,
      Limit: 100,
      ExclusiveStartKey: exclusiveStartKey
    }));

    if (Items && Items.length > 0) {
      await dynamosearch.reindex(Items);
      totalProcessed += Items.length;
      console.log(`Processed ${totalProcessed} items`);
    }

    exclusiveStartKey = LastEvaluatedKey;

    // Save checkpoint
    writeFileSync(checkpointFile, JSON.stringify({
      exclusiveStartKey,
      totalProcessed,
      timestamp: new Date().toISOString()
    }));

  } while (exclusiveStartKey);

  // Delete checkpoint on completion
  unlinkSync(checkpointFile);
  return totalProcessed;
}
```

## Best Practices

1. **Test in staging first** - Validate the reindex process
2. **Use batching** - Process in chunks to avoid memory issues
3. **Rate limit** - Add delays to avoid throttling
4. **Monitor progress** - Log and track reindex status
5. **Handle errors** - Implement retry logic and DLQ
6. **Use checkpoints** - Resume on failure
7. **Validate results** - Compare old vs new index
8. **Off-peak hours** - Reindex during low traffic
9. **Backup first** - Keep old index until validated
10. **Parallel processing** - Speed up with concurrency

## Monitoring Reindex

### CloudWatch Metrics

```typescript
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

const cloudwatch = new CloudWatchClient({});

await cloudwatch.send(new PutMetricDataCommand({
  Namespace: 'DynamoSearch/Reindex',
  MetricData: [{
    MetricName: 'ItemsProcessed',
    Value: batchSize,
    Unit: 'Count',
    Timestamp: new Date()
  }]
}));
```

### Progress Notifications

```typescript
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sns = new SNSClient({});

if (totalProcessed % 10000 === 0) {
  await sns.send(new PublishCommand({
    TopicArn: 'arn:aws:sns:region:account:reindex-progress',
    Message: `Reindex progress: ${totalProcessed} items processed`
  }));
}
```
