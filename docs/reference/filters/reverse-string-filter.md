# ReverseStringFilter

Reverses each token character-by-character.

## Import

```typescript
import ReverseStringFilter from 'dynamosearch/filters/ReverseStringFilter';
```

## Constructor

```typescript
new ReverseStringFilter()
```

No parameters required.

## Example

```typescript
const filter = new ReverseStringFilter();
const tokens = filter.apply([
  { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
  { token: 'world', startOffset: 6, endOffset: 11, position: 1 },
]);
// [
//   { token: 'olleh', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'dlrow', startOffset: 6, endOffset: 11, position: 1 }
// ]
```

## Best For

- Suffix matching
- Reverse wildcard search
- Specialized search patterns

## See Also

- [EdgeNGramTokenFilter](./edge-ngram-token-filter.md) - For prefix matching
