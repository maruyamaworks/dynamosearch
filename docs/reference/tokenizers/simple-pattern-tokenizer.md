# SimplePatternTokenizer

Captures text matching a pattern as tokens.

## Import

```typescript
import SimplePatternTokenizer from 'dynamosearch/tokenizers/SimplePatternTokenizer';
```

## Constructor

```typescript
new SimplePatternTokenizer(options?: { pattern?: RegExp })
```

### Parameters

- **pattern** (`RegExp`, optional) - Pattern to capture (default: `/^$/`)

## Example

```typescript
const tokenizer = new SimplePatternTokenizer({ pattern: /\d+/g });
const tokens = await tokenizer.tokenize('Order 123 and 456');
// [
//   { token: '123', startOffset: 6, endOffset: 9, position: 0 },
//   { token: '456', startOffset: 14, endOffset: 17, position: 1 }
// ]
```

## Behavior

- Extracts text matching the pattern
- Non-matching text is ignored
- Useful for extracting specific data

## Best For

- Extracting specific patterns
- Number extraction
- Simple pattern matching

## See Also

- [PatternTokenizer](./pattern-tokenizer.md) - For more flexible pattern tokenization
- [SimplePatternSplitTokenizer](./simple-pattern-split-tokenizer.md) - For splitting on patterns
