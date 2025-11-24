# Adding DynamoSearch to Existing Tables

This guide explains how to add DynamoSearch to an existing DynamoDB table with historical data. If you're starting with a new table or don't have existing data to index, see [Setting Up for New Tables](/guide/new-tables) instead.

## Overview

The process follows these steps:

1. Enable DynamoDB Streams and Point-in-Time Recovery (PITR) on your existing table
2. Set up DynamoSearch index table and Lambda function
3. Record the exact timestamp when stream processing starts
4. Export historical data to S3 using the recorded timestamp
5. Backfill the index with exported data

This approach ensures data consistency even for tables with frequent updates.

## Step 1: Enable DynamoDB Streams and PITR

First, enable DynamoDB Streams on your existing table:

::: code-group

```bash [AWS CLI]
# Enable DynamoDB Streams
aws dynamodb update-table \
  --table-name articles \
  --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

# Enable PITR (required for S3 export)
aws dynamodb update-continuous-backups \
  --table-name articles \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

```typescript [AWS SDK for JavaScript]
import { DynamoDBClient, UpdateTableCommand, UpdateContinuousBackupsCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

// Enable Streams
await client.send(new UpdateTableCommand({
  TableName: 'articles',
  StreamSpecification: {
    StreamEnabled: true,
    StreamViewType: 'NEW_AND_OLD_IMAGES',
  },
}));

// Enable PITR
await client.send(new UpdateContinuousBackupsCommand({
  TableName: 'articles',
  PointInTimeRecoverySpecification: {
    PointInTimeRecoveryEnabled: true,
  },
}));
```

:::

::: warning
The `StreamViewType` MUST be either `NEW_IMAGE` or `NEW_AND_OLD_IMAGES`.

PITR is required for S3 export functionality. If your table doesn't have PITR enabled yet, wait at least 5 minutes after enabling it before proceeding to export.
:::

## Step 2: Initialize DynamoSearch

Create your DynamoSearch configuration:

```typescript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer';

const analyzer = new StandardAnalyzer();

const dynamosearch = new DynamoSearch({
  indexTableName: 'articles-index',
  attributes: [
    { name: 'title', analyzer, shortName: 't' },
    { name: 'content', analyzer, shortName: 'c' },
  ],
  keys: [
    { name: 'id', type: 'HASH' },
  ],
});
```

See [Setting Up for New Tables - Step 2](/guide/new-tables#step-2-initialize-dynamosearch) for configuration options.

## Step 3: Create the Index Table

Create the search index table:

```typescript
await dynamosearch.createIndexTable({ ifNotExists: true });
```

See [Setting Up for New Tables - Step 3](/guide/new-tables#step-3-create-the-index-table) for manual creation options.

## Step 4: Deploy Stream Processing Lambda

Create and deploy a Lambda function to process DynamoDB Streams:

```javascript
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer';

const analyzer = new StandardAnalyzer();
const dynamosearch = new DynamoSearch({
  indexTableName: 'articles-index',
  attributes: [
    { name: 'title', analyzer, shortName: 't' },
    { name: 'content', analyzer, shortName: 'c' },
  ],
  keys: [
    { name: 'id', type: 'HASH' },
  ],
});

export const handler = async (event) => {
  await dynamosearch.processRecords(event.Records);
};
```

Deploy the Lambda and configure it as a DynamoDB Stream trigger.

::: info
For detailed deployment instructions and AWS SAM/CDK examples, see the [AWS SAM Example](/guide/sam-example) guide.
:::

## Step 5: Record Stream Processing Start Time

**This is a critical step for data consistency.**

After deploying the Lambda function, monitor its logs to find the exact timestamp when it first started processing records:

```bash
# Check CloudWatch Logs for the Lambda function
aws logs tail /aws/lambda/YOUR_FUNCTION_NAME --follow
```

Record the timestamp from the first successful log entry. This timestamp will be used in the next step to ensure no data is missed or duplicated.

::: tip
Be as precise as possible with the timestamp. The Lambda function typically starts processing within seconds of deployment. Check the CloudWatch Logs and note the timestamp of the first invocation.
:::

## Step 6: Export Table to S3

Export your table's historical data to S3 using the timestamp recorded in Step 5:

```bash
# Create S3 bucket (if needed)
aws s3 mb s3://my-dynamodb-exports

# Export table to S3
aws dynamodb export-table-to-point-in-time \
  --table-arn arn:aws:dynamodb:REGION:ACCOUNT_ID:table/articles \
  --s3-bucket my-dynamodb-exports \
  --s3-prefix articles-export \
  --export-format DYNAMODB_JSON \
  --export-time 2025-01-15T10:30:00Z
```

Replace `2025-01-15T10:30:00Z` with your recorded timestamp from Step 5.

::: warning
- Use `DYNAMODB_JSON` format (not ION)
- The export timestamp should be just before stream processing started
- The export may take several minutes to hours depending on table size
:::

Check export status:

```bash
aws dynamodb describe-export --export-arn YOUR_EXPORT_ARN
```

Wait until the status is `COMPLETED`.

## Step 7: Download Export Data

Once the export completes, download the JSON files from S3:

```bash
# List exported files
aws s3 ls s3://my-dynamodb-exports/articles-export/data/

# Download all JSON files
aws s3 cp --recursive s3://my-dynamodb-exports/articles-export/data/ ./export-data/
```

The export contains multiple gzip-compressed JSON files in `DYNAMODB_JSON` format.

## Step 8: Backfill the Index

Create a script to process the exported data and backfill the search index:

```typescript
// backfill.ts
import DynamoSearch from 'dynamosearch';
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

const analyzer = new StandardAnalyzer();
const dynamosearch = new DynamoSearch({
  indexTableName: 'articles-index',
  attributes: [
    { name: 'title', analyzer, shortName: 't' },
    { name: 'content', analyzer, shortName: 'c' },
  ],
  keys: [
    { name: 'id', type: 'HASH' },
  ],
});

async function backfillFromExport(exportDir: string) {
  const files = readdirSync(exportDir).filter(f => f.endsWith('.json.gz'));

  let totalIndexed = 0;
  for (const file of files) {
    console.log(`Processing ${file}...`);

    // Read and decompress
    const compressed = readFileSync(join(exportDir, file));
    const decompressed = gunzipSync(compressed).toString('utf-8');

    // Parse newline-delimited JSON
    const lines = decompressed.trim().split('\n');
    const items = lines.map(line => JSON.parse(line).Item);

    // Reindex in batches
    const batchSize = 1000;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await dynamosearch.reindex(batch);
      totalIndexed += batch.length;
      console.log(`  Indexed ${totalIndexed} items...`);
    }
  }

  console.log(`Backfill complete: ${totalIndexed} items indexed`);
}

// Run backfill
backfillFromExport('./export-data').catch(console.error);
```

Run the backfill script:

```bash
node backfill.ts
```

::: tip
For large datasets, consider using provisioned capacity temporarily if needed.
:::

## Verification

After backfilling, verify that your index is working correctly:

```typescript
// Test search
const results = await dynamosearch.search('machine learning', {
  attributes: ['title^2', 'content'],
  maxItems: 10,
});

console.log('Search Results:');
console.log(JSON.stringify(results.items, null, 2));
```

## Alternative: Simple Scan-Based Backfill

For tables with **infrequent updates** where strict consistency isn't critical, you can use a simpler scan-based approach instead of the PITR + S3 export method:

```typescript
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

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

::: warning
The scan-based approach may result in inconsistencies if:
- Items are added/modified during the scan
- The scan takes a long time on large tables

For production use cases with active tables, the PITR + S3 export method is strongly recommended.
:::

