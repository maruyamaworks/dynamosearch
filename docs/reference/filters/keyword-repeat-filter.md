# KeywordRepeatFilter

Marks tokens as keywords and repeats them for dual processing.

## Import

```typescript
import KeywordRepeatFilter from 'dynamosearch/filters/KeywordRepeatFilter';
```

## Constructor

```typescript
new KeywordRepeatFilter()
```

No parameters required.

## Example

```typescript
const filter = new KeywordRepeatFilter();
const tokens = filter.apply([
  { token: 'running', startOffset: 0, endOffset: 7, position: 0 },
]);
// [
//   { token: 'running', startOffset: 0, endOffset: 7, position: 0, keyword: false },
//   { token: 'running', startOffset: 0, endOffset: 7, position: 0, keyword: true }
// ]
```

## Best For

- Dual processing (stemmed and unstemmed)
- Preserving original form while applying transformations
- Used with stemming filters

## See Also

- [KeywordMarkerFilter](./keyword-marker-filter.md) - For marking specific keywords
- [RemoveDuplicatesTokenFilter](./remove-duplicates-token-filter.md) - For cleanup after dual processing
