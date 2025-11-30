# LowerCaseTokenizer

Splits on non-letter characters and lowercases each token.

## Import

```typescript
import LowerCaseTokenizer from 'dynamosearch/tokenizers/LowerCaseTokenizer';
```

## Constructor

```typescript
new LowerCaseTokenizer()
```

No parameters required.

## Example

```typescript
const tokenizer = new LowerCaseTokenizer();
const tokens = await tokenizer.tokenize('Hello123WORLD456');
// [
//   { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'world', startOffset: 8, endOffset: 13, position: 1 }
// ]
```

## Behavior

- Uses pattern: `/\p{L}+/gu`
- Automatically lowercases tokens
- Works with Unicode letters
- Removes numbers and punctuation

## Best For

- Case-insensitive search
- Letter-only tokenization
- Simple text analysis

## See Also

- [LetterTokenizer](./letter-tokenizer.md) - For letter-based without lowercasing
- [StandardTokenizer](./standard-tokenizer.md) - For word-based tokenization
- [SimpleAnalyzer](/reference/analyzers/simple-analyzer.md) - Uses this tokenizer
