# WhitespaceTokenizer

Splits text on whitespace characters.

## Import

```typescript
import WhitespaceTokenizer from 'dynamosearch/tokenizers/WhitespaceTokenizer';
```

## Constructor

```typescript
new WhitespaceTokenizer(options?: { maxTokenLength?: number })
```

### Parameters

- **maxTokenLength** (`number`, optional) - Maximum token length (default: `255`)

## Example

```typescript
const tokenizer = new WhitespaceTokenizer();
const tokens = await tokenizer.tokenize('hello-world foo_bar');
// [
//   { token: 'hello-world', startOffset: 0, endOffset: 11, position: 0 },
//   { token: 'foo_bar', startOffset: 12, endOffset: 19, position: 1 }
// ]
```

## Behavior

- Splits on pattern: `/\s+/`
- Preserves punctuation and special characters
- Long tokens are split at `maxTokenLength`

## Best For

- Preserving punctuation
- Pre-tokenized input
- Space-delimited data

## See Also

- [StandardTokenizer](./standard-tokenizer.md) - For word-based tokenization
- [KeywordTokenizer](./keyword-tokenizer.md) - For no splitting
- [WhitespaceAnalyzer](/reference/analyzers/whitespace-analyzer.md) - Uses this tokenizer
