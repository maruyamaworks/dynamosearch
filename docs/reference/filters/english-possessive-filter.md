# EnglishPossessiveFilter

Removes English possessive suffixes ('s).

## Import

```typescript
import EnglishPossessiveFilter from 'dynamosearch/filters/EnglishPossessiveFilter';
```

## Constructor

```typescript
new EnglishPossessiveFilter()
```

No parameters required.

## Example

```typescript
const filter = new EnglishPossessiveFilter();
const tokens = filter.apply([
  { token: "john's", startOffset: 0, endOffset: 6, position: 0 },
  { token: "dogs'", startOffset: 7, endOffset: 12, position: 1 },
]);
// [
//   { token: 'john', startOffset: 0, endOffset: 4, position: 0 },
//   { token: 'dogs', startOffset: 7, endOffset: 11, position: 1 }
// ]
```

## Best For

- English possessive handling
- English text normalization
- Removing 's and s' endings

## See Also

- [EnglishAnalyzer](/reference/analyzers/english-analyzer.md) - Uses this filter
- [ApostropheFilter](./apostrophe-filter.md) - For general apostrophe handling
