# RemoveDuplicatesTokenFilter

Removes duplicate tokens at the same position.

## Import

```typescript
import RemoveDuplicatesTokenFilter from 'dynamosearch/filters/RemoveDuplicatesTokenFilter';
```

## Constructor

```typescript
new RemoveDuplicatesTokenFilter()
```

No parameters required.

## Example

```typescript
const filter = new RemoveDuplicatesTokenFilter();
const tokens = filter.apply([
  { token: 'run', startOffset: 0, endOffset: 7, position: 0 },
  { token: 'running', startOffset: 0, endOffset: 7, position: 0 }, // Same position
  { token: 'fast', startOffset: 8, endOffset: 12, position: 1 },
]);
// [
//   { token: 'run', startOffset: 0, endOffset: 7, position: 0 },
//   { token: 'fast', startOffset: 8, endOffset: 12, position: 1 }
// ]
```

## Best For

- Removing duplicates from stemming
- Cleanup after keyword repeat
- Position-aware deduplication

## See Also

- [UniqueFilter](./unique-filter.md) - For removing all duplicates
- [KeywordRepeatFilter](./keyword-repeat-filter.md) - Often used before this filter
