# ShingleFilter

Creates word shingles (multi-word tokens) from consecutive tokens.

## Import

```typescript
import ShingleFilter from 'dynamosearch/filters/ShingleFilter';
```

## Constructor

```typescript
new ShingleFilter(options?: { minShingleSize?: number; maxShingleSize?: number; outputUnigrams?: boolean })
```

### Parameters

- **minShingleSize** (`number`, optional) - Minimum shingle size (default: `2`)
- **maxShingleSize** (`number`, optional) - Maximum shingle size (default: `2`)
- **outputUnigrams** (`boolean`, optional) - Include original tokens (default: `true`)

## Example

```typescript
const filter = new ShingleFilter({ minShingleSize: 2, maxShingleSize: 2 });
const tokens = filter.apply([
  { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
  { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
  { token: 'brown', startOffset: 10, endOffset: 15, position: 2 },
]);
// Generates: the, quick, brown, the quick, quick brown
```

## Best For

- Phrase matching
- Multi-word token generation
- Improving phrase search

## See Also

- [NGramTokenFilter](./ngram-token-filter.md) - For character n-grams
- [CJKBigramFilter](./cjk-bigram-filter.md) - For CJK bigrams
