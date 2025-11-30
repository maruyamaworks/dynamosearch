# SimpleAnalyzer

Letter-based tokenization with automatic lowercasing.

## Import

```typescript
import SimpleAnalyzer from 'dynamosearch/analyzers/SimpleAnalyzer';
```

## Constructor

```typescript
new SimpleAnalyzer()
```

No parameters required.

## Pipeline

- **Tokenizer**: `LowerCaseTokenizer`
- **Filters**: None

## Example

```typescript
const analyzer = new SimpleAnalyzer();
const tokens = await analyzer.analyze('Hello-World123');
// [
//   { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'world', startOffset: 6, endOffset: 11, position: 1 }
// ]
```

## Behavior

- Splits on non-letter characters
- Automatically converts to lowercase
- Removes numbers and punctuation
- Works with Unicode letters

## Best For

- Simple text tokenization
- When you only want letters
- Case-insensitive search without stop words

## See Also

- [StandardAnalyzer](./standard-analyzer.md) - For word-based tokenization
- [StopAnalyzer](./stop-analyzer.md) - For letter-based with stop words
- [WhitespaceAnalyzer](./whitespace-analyzer.md) - For preserving punctuation
