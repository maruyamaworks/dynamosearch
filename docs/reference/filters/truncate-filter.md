# TruncateFilter

Truncates tokens exceeding a specified length.

## Import

```typescript
import TruncateFilter from 'dynamosearch/filters/TruncateFilter';
```

## Constructor

```typescript
new TruncateFilter(options?: { length?: number })
```

### Parameters

- **length** (`number`, optional) - Maximum character length (default: `10`)

## Example

```typescript
const filter = new TruncateFilter({ length: 5 });
const tokens = filter.apply([
  { token: 'hello', startOffset: 0, endOffset: 5, position: 0 }, // 5 chars - unchanged
  { token: 'world', startOffset: 6, endOffset: 11, position: 1 }, // 5 chars - unchanged
  { token: 'truncate', startOffset: 12, endOffset: 20, position: 2 }, // 8 chars - truncated
]);
// [
//   { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'world', startOffset: 6, endOffset: 11, position: 1 },
//   { token: 'trunc', startOffset: 12, endOffset: 17, position: 2 }
// ]
```

## Best For

- Limiting token length
- Storage optimization
- Prefix matching

## See Also

- [LengthFilter](./length-filter.md) - For filtering by length range
- [EdgeNGramTokenFilter](./edge-ngram-token-filter.md) - For edge n-grams
