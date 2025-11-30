# WhitespaceAnalyzer

Splits text on whitespace characters.

## Import

```typescript
import WhitespaceAnalyzer from 'dynamosearch/analyzers/WhitespaceAnalyzer';
```

## Constructor

```typescript
new WhitespaceAnalyzer()
```

No parameters required.

## Pipeline

- **Tokenizer**: `WhitespaceTokenizer`
- **Filters**: None

## Example

```typescript
const analyzer = new WhitespaceAnalyzer();
const tokens = await analyzer.analyze('hello-world foo_bar');
// [
//   { token: 'hello-world', startOffset: 0, endOffset: 11, position: 0 },
//   { token: 'foo_bar', startOffset: 12, endOffset: 19, position: 1 }
// ]
```

## Behavior

- Splits only on whitespace (spaces, tabs, newlines)
- Preserves punctuation and special characters
- Case-sensitive (preserves original case)
- Preserves numbers

## Best For

- Preserving punctuation and special characters
- Pre-tokenized input
- When whitespace is the only delimiter

## See Also

- [StandardAnalyzer](./standard-analyzer.md) - For word-based tokenization
- [SimpleAnalyzer](./simple-analyzer.md) - For letter-only tokenization
- [KeywordAnalyzer](./keyword-analyzer.md) - For treating entire input as one token
