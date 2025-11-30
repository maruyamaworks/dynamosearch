# LengthFilter

Filters out tokens outside a specified length range.

## Import

```typescript
import LengthFilter from 'dynamosearch/filters/LengthFilter';
```

## Constructor

```typescript
new LengthFilter(options?: { min?: number; max?: number })
```

### Parameters

- **min** (`number`, optional) - Minimum character length (default: `0`)
- **max** (`number`, optional) - Maximum character length (default: `2147483647`)

## Example

```typescript
const filter = new LengthFilter({ min: 3, max: 20 });
const tokens = filter.apply([
  { token: 'hi', startOffset: 0, endOffset: 2, position: 0 }, // Too short
  { token: 'hello', startOffset: 3, endOffset: 8, position: 1 }, // OK
  { token: 'a', startOffset: 9, endOffset: 10, position: 2 }, // Too short
  { token: 'verylongwordthatexceedslimit', startOffset: 11, endOffset: 39, position: 3 }, // Too long
]);
// [
//   { token: 'hello', startOffset: 3, endOffset: 8, position: 1 }
// ]
```

## Best For

- Removing very short tokens
- Limiting token length
- Quality filtering

## See Also

- [TruncateFilter](./truncate-filter.md) - For truncating long tokens
- [LimitTokenCountFilter](./limit-token-count-filter.md) - For limiting token count
