# PorterStemFilter

Applies Porter stemming algorithm for English.

## Import

```typescript
import PorterStemFilter from 'dynamosearch/filters/PorterStemFilter';
```

## Constructor

```typescript
new PorterStemFilter()
```

No parameters required.

## Example

```typescript
const filter = new PorterStemFilter();
const tokens = filter.apply([
  { token: 'running', startOffset: 0, endOffset: 7, position: 0 },
  { token: 'runs', startOffset: 8, endOffset: 12, position: 1 },
  { token: 'ran', startOffset: 13, endOffset: 16, position: 2 },
  { token: 'runner', startOffset: 17, endOffset: 23, position: 3 },
]);
// [
//   { token: 'run', startOffset: 0, endOffset: 7, position: 0 },
//   { token: 'run', startOffset: 8, endOffset: 12, position: 1 },
//   { token: 'ran', startOffset: 13, endOffset: 16, position: 2 },
//   { token: 'runner', startOffset: 17, endOffset: 23, position: 3 }
// ]
```

## Best For

- English text search
- Finding word variants
- Improving recall
- Reducing index size

## See Also

- [SnowballFilter](./snowball-filter.md) - For multi-language stemming
- [EnglishAnalyzer](/reference/analyzers/english-analyzer.md) - Uses this filter
