# ApostropheFilter

Removes apostrophes and text after apostrophes.

## Import

```typescript
import ApostropheFilter from 'dynamosearch/filters/ApostropheFilter';
```

## Constructor

```typescript
new ApostropheFilter()
```

No parameters required.

## Example

```typescript
const filter = new ApostropheFilter();
const tokens = filter.apply([
  { token: "don't", startOffset: 0, endOffset: 5, position: 0 },
  { token: "it's", startOffset: 6, endOffset: 10, position: 1 },
]);
// [
//   { token: 'don', startOffset: 0, endOffset: 3, position: 0 },
//   { token: 'it', startOffset: 6, endOffset: 8, position: 1 }
// ]
```

## Best For

- Removing contractions
- General apostrophe handling
- English text normalization

## See Also

- [EnglishPossessiveFilter](./english-possessive-filter.md) - For possessive-specific handling
- [ElisionFilter](./elision-filter.md) - For French elisions
