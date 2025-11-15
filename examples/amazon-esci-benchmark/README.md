# Amazon ESCI Benchmark Example

This example demonstrates how to index and search Amazon product data using DynamoSearch with Japanese text analysis.

## Overview

This example uses the [Amazon ESCI (Shopping Queries) dataset](https://github.com/amazon-science/esci-data) to build a full-text search index for Japanese product data. It demonstrates:

- Parallel processing of large datasets using Node.js cluster
- Exporting search tokens to JSON Lines format
- Importing data to DynamoDB using S3 Import
- Full-text search with BM25 ranking

## Prerequisites

- Node.js 20+
- AWS CLI configured with appropriate credentials
- An S3 bucket for importing data to DynamoDB

## Setup

Install dependencies:

```bash
npm install
```

## Step 1: Download Dataset

Download the Amazon product dataset:

```bash
wget https://github.com/amazon-science/esci-data/raw/refs/heads/main/shopping_queries_dataset/shopping_queries_dataset_products.parquet
```

## Step 2: Generate Index Files

Run the indexing script to process the dataset and generate JSON Lines files:

```bash
node index.ts
```

This script will:
- Filter Japanese products from the dataset
- Use all available CPU cores to process products in parallel
- Tokenize product titles, descriptions, bullet points, brands, and colors using Japanese text analysis
- Output token files to the `outputs/` directory (`output1.jsonl`, `output2.jsonl`, etc.)
- Generate a metadata file (`outputs/metadata.jsonl`) containing document and token counts

## Step 3: Upload to S3

Upload the generated files to your S3 bucket:

```bash
aws s3 cp outputs/ s3://your-bucket-name/dynamosearch-demo/ --recursive
```

Replace `your-bucket-name` with your actual S3 bucket name.

## Step 4: Import to DynamoDB

Use DynamoDB's S3 Import feature to create a table from the uploaded files:

```bash
aws dynamodb import-table \
  --s3-bucket-source S3Bucket=your-bucket-name,S3KeyPrefix=dynamosearch-demo/ \
  --input-format DYNAMODB_JSON \
  --input-compression-type NONE \
  --table-creation-parameters '{
    "TableName": "dynamosearch-demo-products-jp-index",
    "AttributeDefinitions": [
      { "AttributeName": "p", "AttributeType": "S" },
      { "AttributeName": "s", "AttributeType": "B" },
      { "AttributeName": "k", "AttributeType": "S" },
      { "AttributeName": "h", "AttributeType": "B" }
    ],
    "KeySchema": [
      { "AttributeName": "p", "KeyType": "HASH" },
      { "AttributeName": "s", "KeyType": "RANGE" }
    ],
    "GlobalSecondaryIndexes": [
      {
        "IndexName": "keys-index",
        "KeySchema": [
          { "AttributeName": "k", "KeyType": "HASH" }
        ],
        "Projection": { "ProjectionType": "KEYS_ONLY" }
      },
      {
        "IndexName": "hash-index",
        "KeySchema": [
          { "AttributeName": "p", "KeyType": "HASH" },
          { "AttributeName": "h", "KeyType": "RANGE" }
        ],
        "Projection": { "ProjectionType": "KEYS_ONLY" }
      }
    ],
    "BillingMode": "PAY_PER_REQUEST"
  }'
```

## Step 5: Wait for Table Creation

Monitor the import status:

```bash
aws dynamodb describe-import \
  --import-arn $(aws dynamodb list-imports --table-arn arn:aws:dynamodb:REGION:ACCOUNT:table/dynamosearch-demo-products-jp-index --query 'ImportSummaryList[0].ImportArn' --output text)
```

Replace `REGION` and `ACCOUNT` with your AWS region and account ID.

The import process may take several minutes depending on the dataset size. Wait until the status shows `COMPLETED`.

## Step 6: Search

Once the table is ready, run searches using the search script:

```bash
node search.ts "キーボード"
```

Replace `"キーボード"` with any Japanese search query. The script will:
- Tokenize the query using the same Japanese analyzer
- Search across product titles and descriptions
- Display consumed capacity and top results with BM25 scores

### Example Output

```
===== RESULTS ======
Query Time: 1.184s
Consumed Capacity: 10.5
Search Results: [
  { score: 12.345, title: 'ワイヤレスキーボード 静音...' },
  { score: 10.234, title: 'メカニカルキーボード RGB...' },
  { score: 8.123, title: 'Bluetooth キーボード...' }
]
```

## Configuration

The index is configured to search the following product attributes:

- `product_title` (shortName: `t`) - Product title
- `product_description` (shortName: `d`) - Product description
- `product_bullet_point` (shortName: `p`) - Product bullet points
- `product_brand` (shortName: `b`) - Product brand
- `product_color` (shortName: `c`) - Product color

The search script queries only `product_title` and `product_description` by default. You can modify the `attributes` parameter in `search.ts` to search other fields.

## Cleanup

To delete the DynamoDB table:

```bash
aws dynamodb delete-table --table-name dynamosearch-demo-products-jp-index
```

To remove S3 files:

```bash
aws s3 rm s3://your-bucket-name/dynamosearch-demo/ --recursive
```
