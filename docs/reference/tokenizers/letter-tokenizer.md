# LetterTokenizer

Splits on non-letter characters using Unicode letter property.

## Import

```typescript
import LetterTokenizer from 'dynamosearch/tokenizers/LetterTokenizer';
```

## Constructor

```typescript
new LetterTokenizer()
```

No parameters required.

## Example

```typescript
const tokenizer = new LetterTokenizer();
const tokens = await tokenizer.tokenize('Hello123World456');
// [
//   { token: 'Hello', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'World', startOffset: 8, endOffset: 13, position: 1 }
// ]
```

## Behavior

- Uses pattern: `/\p{L}+/gu`
- Preserves case
- Works with Unicode letters
- Removes numbers and punctuation

## Best For

- Extracting letter sequences
- International text
- When numbers/punctuation should be removed

## See Also

- [LowerCaseTokenizer](./lowercase-tokenizer.md) - For letter-based with automatic lowercasing
- [StandardTokenizer](./standard-tokenizer.md) - For word-based tokenization
- [WhitespaceTokenizer](./whitespace-tokenizer.md) - For preserving punctuation
