# EdgeNGramTokenFilter

Generates edge n-grams from the beginning of each token.

## Import

```typescript
import EdgeNGramTokenFilter from 'dynamosearch/filters/EdgeNGramTokenFilter';
```

## Constructor

```typescript
new EdgeNGramTokenFilter(options?: { minGram?: number; maxGram?: number })
```

### Parameters

- **minGram** (`number`, optional) - Minimum n-gram size (default: `1`)
- **maxGram** (`number`, optional) - Maximum n-gram size (default: `2`)

## Example

```typescript
const filter = new EdgeNGramTokenFilter({ minGram: 2, maxGram: 4 });
const tokens = filter.apply([
  { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
]);
// Generates edge n-grams: he, hel, hell
```

## Best For

- Autocomplete from beginning
- Prefix matching
- Search-as-you-type

## See Also

- [NGramTokenFilter](./ngram-token-filter.md) - For all n-grams
- [TruncateFilter](./truncate-filter.md) - For simple prefix truncation
