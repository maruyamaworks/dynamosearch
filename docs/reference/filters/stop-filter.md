# StopFilter

Removes stop words from the token stream.

## Import

```typescript
import StopFilter from 'dynamosearch/filters/StopFilter';
```

## Constructor

```typescript
new StopFilter(options?: { stopWords?: '_english_' | '_none_' | string[] })
```

### Parameters

- **stopWords** (`'_english_' | '_none_' | string[]`, optional) - Stop words to remove (default: `'_english_'`)

## Examples

### Built-in English Stop Words

```typescript
const filter = new StopFilter({ stopWords: '_english_' });
const tokens = filter.apply([
  { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
  { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
  { token: 'brown', startOffset: 10, endOffset: 15, position: 2 },
  { token: 'fox', startOffset: 16, endOffset: 19, position: 3 },
]);
// [
//   { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
//   { token: 'brown', startOffset: 10, endOffset: 15, position: 2 },
//   { token: 'fox', startOffset: 16, endOffset: 19, position: 3 }
// ]
```

### Custom Stop Words

```typescript
const filter = new StopFilter({ stopWords: ['quick', 'brown'] });
const tokens = filter.apply([
  { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
  { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
  { token: 'brown', startOffset: 10, endOffset: 15, position: 2 },
  { token: 'fox', startOffset: 16, endOffset: 19, position: 3 },
]);
// [
//   { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
//   { token: 'fox', startOffset: 16, endOffset: 19, position: 3 }
// ]
```

## Available Stop Word Lists

- **_english_** - Common English stop words (the, a, an, and, or, but, etc.)
- **_none_** - Empty list (no filtering)
- **Custom array** - Your own list of stop words

## Best For

- English text search
- Reducing index size
- Improving search relevance
- Filtering common words

## See Also

- [StopAnalyzer](/reference/analyzers/stop-analyzer.md) - Uses this filter
- [KeepWordFilter](./keep-word-filter.md) - For keeping specific words
