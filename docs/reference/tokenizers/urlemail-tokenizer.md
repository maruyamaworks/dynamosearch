# URLEmailTokenizer

Preserves URLs and email addresses as complete tokens.

## Import

```typescript
import URLEmailTokenizer from 'dynamosearch/tokenizers/URLEmailTokenizer';
```

## Constructor

```typescript
new URLEmailTokenizer(options?: { maxTokenLength?: number })
```

### Parameters

- **maxTokenLength** (`number`, optional) - Maximum token length (default: `255`)

## Example

```typescript
const tokenizer = new URLEmailTokenizer();
const tokens = await tokenizer.tokenize('Visit https://example.com or email admin@example.com');
// [
//   { token: 'Visit', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'https://example.com', startOffset: 6, endOffset: 25, position: 1 },
//   { token: 'or', startOffset: 26, endOffset: 28, position: 2 },
//   { token: 'email', startOffset: 29, endOffset: 34, position: 3 },
//   { token: 'admin@example.com', startOffset: 35, endOffset: 52, position: 4 }
// ]
```

## Behavior

- Preserves complete URLs (http/https)
- Preserves complete email addresses
- Tokenizes remaining text like StandardTokenizer

## Best For

- Content with URLs
- Email address extraction
- Web content indexing

## See Also

- [StandardTokenizer](./standard-tokenizer.md) - For general text tokenization
- [KeywordTokenizer](./keyword-tokenizer.md) - For treating entire input as one token
