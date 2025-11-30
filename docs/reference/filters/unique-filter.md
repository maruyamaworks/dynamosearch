# UniqueFilter

Removes duplicate tokens from the token stream.

## Import

```typescript
import UniqueFilter from 'dynamosearch/filters/UniqueFilter';
```

## Constructor

```typescript
new UniqueFilter()
```

No parameters required.

## Example

```typescript
const filter = new UniqueFilter();
const tokens = filter.apply([
  { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
  { token: 'world', startOffset: 6, endOffset: 11, position: 1 },
  { token: 'hello', startOffset: 12, endOffset: 17, position: 2 }, // Duplicate
  { token: 'world', startOffset: 18, endOffset: 23, position: 3 }, // Duplicate
]);
// [
//   { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'world', startOffset: 6, endOffset: 11, position: 1 }
// ]
```

## Best For

- Removing duplicate tokens
- Reducing index size
- Deduplicating n-gram output

## See Also

- [RemoveDuplicatesTokenFilter](./remove-duplicates-token-filter.md) - For removing duplicates at same position
