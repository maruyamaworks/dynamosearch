# StandardTokenizer

Word-based tokenization that splits on hyphens, spaces, commas, and periods.

## Import

```typescript
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer';
```

## Constructor

```typescript
new StandardTokenizer(options?: { maxTokenLength?: number })
```

### Parameters

- **maxTokenLength** (`number`, optional) - Maximum token length (default: `255`)

## Example

```typescript
const tokenizer = new StandardTokenizer();
const tokens = await tokenizer.tokenize('Hello, World! How are you?');
// [
//   { token: 'Hello', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'World', startOffset: 7, endOffset: 12, position: 1 },
//   { token: 'How', startOffset: 14, endOffset: 17, position: 2 },
//   { token: 'are', startOffset: 18, endOffset: 21, position: 3 },
//   { token: 'you', startOffset: 22, endOffset: 25, position: 4 }
// ]
```

## Behavior

- Splits on pattern: `/[-\s,.]+/`
- Long tokens exceeding `maxTokenLength` are split at intervals
- Preserves case (use `LowerCaseFilter` to normalize)

## Best For

- English and Western languages
- General text tokenization
- Word-based search

## See Also

- [IntlSegmenterTokenizer](./intl-segmenter-tokenizer.md) - For locale-aware tokenization
- [WhitespaceTokenizer](./whitespace-tokenizer.md) - For whitespace-only splitting
- [LetterTokenizer](./letter-tokenizer.md) - For letter-based tokenization
