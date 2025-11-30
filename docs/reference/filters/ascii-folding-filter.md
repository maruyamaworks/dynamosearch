# ASCIIFoldingFilter

Converts accented characters to their ASCII equivalents.

## Import

```typescript
import ASCIIFoldingFilter from 'dynamosearch/filters/ASCIIFoldingFilter';
```

## Constructor

```typescript
new ASCIIFoldingFilter()
```

No parameters required.

## Example

```typescript
const filter = new ASCIIFoldingFilter();
const tokens = filter.apply([
  { token: 'café', startOffset: 0, endOffset: 4, position: 0 },
  { token: 'résumé', startOffset: 5, endOffset: 11, position: 1 },
  { token: 'naïve', startOffset: 12, endOffset: 17, position: 2 },
  { token: 'Zürich', startOffset: 18, endOffset: 24, position: 3 },
]);
// [
//   { token: 'cafe', startOffset: 0, endOffset: 4, position: 0 },
//   { token: 'resume', startOffset: 5, endOffset: 11, position: 1 },
//   { token: 'naive', startOffset: 12, endOffset: 17, position: 2 },
//   { token: 'Zurich', startOffset: 18, endOffset: 24, position: 3 }
// ]
```

## Best For

- Normalizing international text
- Language-agnostic search
- Handling user input with accents
- Improving search recall

## See Also

- [ICUNormalizer](/reference/char-filters/icu-normalizer.md) - For Unicode normalization
