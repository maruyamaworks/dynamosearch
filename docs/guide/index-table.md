# Index Table

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
