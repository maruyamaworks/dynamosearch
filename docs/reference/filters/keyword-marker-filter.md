# KeywordMarkerFilter

Marks specified tokens as keywords to protect them from stemming.

## Import

```typescript
import KeywordMarkerFilter from 'dynamosearch/filters/KeywordMarkerFilter';
```

## Constructor

```typescript
new KeywordMarkerFilter(options: { keywords: string[] })
```

### Parameters

- **keywords** (`string[]`) - Array of words to mark as keywords

## Example

```typescript
const filter = new KeywordMarkerFilter({ keywords: ['running', 'programming'] });
const tokens = filter.apply([
  { token: 'running', startOffset: 0, endOffset: 7, position: 0 },
  { token: 'jumping', startOffset: 8, endOffset: 15, position: 1 },
]);
// [
//   { token: 'running', startOffset: 0, endOffset: 7, position: 0, keyword: true },
//   { token: 'jumping', startOffset: 8, endOffset: 15, position: 1, keyword: false }
// ]
```

## Best For

- Protecting specific words from stemming
- Preserving technical terms
- Domain-specific vocabulary

## See Also

- [KeywordRepeatFilter](./keyword-repeat-filter.md) - For dual processing
- [PorterStemFilter](./porter-stem-filter.md) - Respects keyword markers
