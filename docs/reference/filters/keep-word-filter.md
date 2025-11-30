# KeepWordFilter

Keeps only tokens that match a specified word list.

## Import

```typescript
import KeepWordFilter from 'dynamosearch/filters/KeepWordFilter';
```

## Constructor

```typescript
new KeepWordFilter(options: { words: string[] })
```

### Parameters

- **words** (`string[]`) - Array of words to keep

## Example

```typescript
const filter = new KeepWordFilter({ words: ['important', 'critical'] });
const tokens = filter.apply([
  { token: 'important', startOffset: 0, endOffset: 9, position: 0 },
  { token: 'regular', startOffset: 10, endOffset: 17, position: 1 },
  { token: 'critical', startOffset: 18, endOffset: 26, position: 2 },
]);
// [
//   { token: 'important', startOffset: 0, endOffset: 9, position: 0 },
//   { token: 'critical', startOffset: 18, endOffset: 26, position: 2 }
// ]
```

## Best For

- Filtering to specific vocabulary
- Extracting important terms
- Domain-specific filtering

## See Also

- [StopFilter](./stop-filter.md) - For removing specific words
