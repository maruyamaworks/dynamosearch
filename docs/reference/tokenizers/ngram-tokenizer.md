# NGramTokenizer

Generates character n-grams for partial matching.

## Import

```typescript
import NGramTokenizer from 'dynamosearch/tokenizers/NGramTokenizer';
```

## Constructor

```typescript
new NGramTokenizer(options?: { minGram?: number; maxGram?: number })
```

### Parameters

- **minGram** (`number`, optional) - Minimum n-gram size (default: `1`)
- **maxGram** (`number`, optional) - Maximum n-gram size (default: `2`)

## Example

```typescript
const tokenizer = new NGramTokenizer({ minGram: 2, maxGram: 3 });
const tokens = await tokenizer.tokenize('hello');
// [
//   { token: 'he', startOffset: 0, endOffset: 2, position: 0 },
//   { token: 'el', startOffset: 1, endOffset: 3, position: 1 },
//   { token: 'll', startOffset: 2, endOffset: 4, position: 2 },
//   { token: 'lo', startOffset: 3, endOffset: 5, position: 3 },  // 2-grams
//   { token: 'hel', startOffset: 0, endOffset: 3, position: 4 },
//   { token: 'ell', startOffset: 1, endOffset: 4, position: 5 },
//   { token: 'llo', startOffset: 2, endOffset: 5, position: 6 }  // 3-grams
// ]
```

## Behavior

- Generates n-grams of sizes from `minGram` to `maxGram`
- Creates overlapping character sequences
- Useful for partial/substring matching

## Best For

- Partial/substring matching
- Autocomplete suggestions
- Fuzzy matching
- Short text fields
- Search-as-you-type

## Performance Notes

- Generates many tokens (impacts storage and search cost)
- Use with short text fields only
- Consider using `minGram >= 2` to reduce token count

## See Also

- [NGramTokenFilter](/reference/filters/ngram-token-filter.md) - For token-level n-grams
- [EdgeNGramTokenFilter](/reference/filters/edge-ngram-token-filter.md) - For edge n-grams
