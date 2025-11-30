# CommonGramsFilter

Generates bigrams for frequently occurring terms (common grams).

## Import

```typescript
import CommonGramsFilter from 'dynamosearch/filters/CommonGramsFilter';
```

## Constructor

```typescript
new CommonGramsFilter(options: { commonWords: string[] })
```

### Parameters

- **commonWords** (`string[]`) - Array of common words to create bigrams for

## Example

```typescript
const filter = new CommonGramsFilter({ commonWords: ['the', 'of'] });
const tokens = filter.apply([
  { token: 'best', startOffset: 0, endOffset: 4, position: 0 },
  { token: 'of', startOffset: 5, endOffset: 7, position: 1 },
  { token: 'times', startOffset: 8, endOffset: 13, position: 2 },
]);
// Generates: best, of, best_of, of_times, times
```

## Best For

- Phrase matching with common words
- Improving search with stop words
- Creating bigrams for frequent terms

## See Also

- [ShingleFilter](./shingle-filter.md) - For general word shingles
- [StopFilter](./stop-filter.md) - For removing stop words
