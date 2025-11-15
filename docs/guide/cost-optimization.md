# Cost Optimization

Since search indexes can contain a large number of items (one item per token per document), optimizing your DynamoDB usage can significantly reduce costs.

## Use Short Attribute Names

Reduce storage costs and RCU/RRU consumption by using short names:

```typescript
const dynamosearch = new DynamoSearch({
  indexTableName: 'search-index',
  attributes: [
    { name: 'title', shortName: 't', analyzer },
    { name: 'description', shortName: 'd', analyzer },
  ],
  keys: [{ name: 'id', type: 'HASH' }],
});
```

Short names are used in the partition key:
- Without: `description;machine` (19 bytes)
- With: `d;machine` (9 bytes)

## Selective Indexing

Only index fields that need to be searchable:

```typescript
// ❌ Index everything
const dynamosearch = new DynamoSearch({
  attributes: [
    { name: 'title', analyzer },
    { name: 'description', analyzer },
    { name: 'metadata', analyzer }, // Not searchable, wastes space
    { name: 'tags', analyzer },
    { name: 'internalNotes', analyzer }, // Not searchable, wastes space
  ],
});

// ✅ Index only searchable fields
const dynamosearch = new DynamoSearch({
  attributes: [
    { name: 'title', analyzer },
    { name: 'description', analyzer },
    { name: 'tags', analyzer },
  ],
});
```

## On-Demand vs Provisioned

**On-Demand** (default):
```typescript
await dynamosearch.createIndexTable({
  tableProperties: { BillingMode: 'PAY_PER_REQUEST' },
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
      WriteCapacityUnits: 5,
    },
  },
});
```
- Lower cost for consistent workloads
- Requires capacity planning
- Can use auto-scaling

## Monitor Consumed Capacity

Track capacity usage:

```typescript
const results = await dynamosearch.search('query', {
  attributes: ['title', 'description'],
});

console.log('Capacity units consumed:', results.consumedCapacity.capacityUnits);
console.log('Table:', results.consumedCapacity.tableName);
```

## Search Fewer Attributes

```typescript
// More expensive
const results = await dynamosearch.search('query', {
  attributes: ['title', 'description', 'tags'],
});

// Less expensive
const results = await dynamosearch.search('query', {
  attributes: ['title'],
});
```
