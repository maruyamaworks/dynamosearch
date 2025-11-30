# NGramTokenFilter

Generates n-grams from tokens at the token level (after tokenization).

## Import

```typescript
import NGramTokenFilter from 'dynamosearch/filters/NGramTokenFilter';
```

## Constructor

```typescript
new NGramTokenFilter(options?: { minGram?: number; maxGram?: number })
```

### Parameters

- **minGram** (`number`, optional) - Minimum n-gram size (default: `1`)
- **maxGram** (`number`, optional) - Maximum n-gram size (default: `2`)

## Example

```typescript
const filter = new NGramTokenFilter({ minGram: 2, maxGram: 3 });
const tokens = filter.apply([
  { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
]);
// Generates n-grams: he, el, ll, lo, hel, ell, llo
```

## Best For

- Partial token matching
- Autocomplete
- Fuzzy search

## See Also

- [NGramTokenizer](/reference/tokenizers/ngram-tokenizer.md) - For character-level n-grams
- [EdgeNGramTokenFilter](./edge-ngram-token-filter.md) - For edge n-grams
