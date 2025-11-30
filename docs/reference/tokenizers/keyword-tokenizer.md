# KeywordTokenizer

Returns the entire input as a single token.

## Import

```typescript
import KeywordTokenizer from 'dynamosearch/tokenizers/KeywordTokenizer';
```

## Constructor

```typescript
new KeywordTokenizer()
```

No parameters required.

## Example

```typescript
const tokenizer = new KeywordTokenizer();
const tokens = await tokenizer.tokenize('product-abc-123-xyz');
// [
//   { token: 'product-abc-123-xyz', startOffset: 0, endOffset: 19, position: 0 }
// ]
```

## Behavior

- Treats entire input as single token
- Preserves all characters
- No splitting or transformation

## Best For

- Exact string matching
- IDs and identifiers
- Categories and tags
- Status codes
- Structured identifiers

## Use Cases

```typescript
// Product codes
await tokenizer.tokenize('SKU-ABC-123');

// Email addresses
await tokenizer.tokenize('user@example.com');

// Status values
await tokenizer.tokenize('in-progress');
```

## See Also

- [WhitespaceTokenizer](./whitespace-tokenizer.md) - For splitting on whitespace
- [PatternTokenizer](./pattern-tokenizer.md) - For custom pattern splitting
