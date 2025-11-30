# LimitTokenCountFilter

Limits the total number of tokens output.

## Import

```typescript
import LimitTokenCountFilter from 'dynamosearch/filters/LimitTokenCountFilter';
```

## Constructor

```typescript
new LimitTokenCountFilter(options?: { maxTokenCount?: number })
```

### Parameters

- **maxTokenCount** (`number`, optional) - Maximum number of tokens to keep (default: `1`)

## Example

```typescript
const filter = new LimitTokenCountFilter({ maxTokenCount: 3 });
const tokens = filter.apply([
  { token: 'first', startOffset: 0, endOffset: 5, position: 0 },
  { token: 'second', startOffset: 6, endOffset: 12, position: 1 },
  { token: 'third', startOffset: 13, endOffset: 18, position: 2 },
  { token: 'fourth', startOffset: 19, endOffset: 25, position: 3 },
  { token: 'fifth', startOffset: 26, endOffset: 31, position: 4 },
]);
// [
//   { token: 'first', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'second', startOffset: 6, endOffset: 12, position: 1 },
//   { token: 'third', startOffset: 13, endOffset: 18, position: 2 }
// ]
```

## Best For

- Limiting index size
- Taking first N tokens
- Title/heading analysis

## See Also

- [LengthFilter](./length-filter.md) - For filtering by token length
