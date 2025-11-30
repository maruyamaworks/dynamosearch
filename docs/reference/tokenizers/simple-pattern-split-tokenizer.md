# SimplePatternSplitTokenizer

Splits input at pattern matches.

## Import

```typescript
import SimplePatternSplitTokenizer from 'dynamosearch/tokenizers/SimplePatternSplitTokenizer';
```

## Constructor

```typescript
new SimplePatternSplitTokenizer(options?: { pattern?: RegExp })
```

### Parameters

- **pattern** (`RegExp`, optional) - Pattern to split on (default: `/^$/`)

## Example

```typescript
const tokenizer = new SimplePatternSplitTokenizer({ pattern: /[,;]+/ });
const tokens = await tokenizer.tokenize('apple,banana;cherry');
// [
//   { token: 'apple', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'banana', startOffset: 6, endOffset: 12, position: 1 },
//   { token: 'cherry', startOffset: 13, endOffset: 19, position: 2 }
// ]
```

## Behavior

- Splits text at pattern matches
- Pattern matches are discarded
- Simple alternative to PatternTokenizer

## Best For

- Custom delimiters
- CSV-like data
- Simple splitting logic

## See Also

- [PatternTokenizer](./pattern-tokenizer.md) - For more flexible pattern tokenization
- [SimplePatternTokenizer](./simple-pattern-tokenizer.md) - For pattern matching
- [WhitespaceTokenizer](./whitespace-tokenizer.md) - For whitespace splitting
