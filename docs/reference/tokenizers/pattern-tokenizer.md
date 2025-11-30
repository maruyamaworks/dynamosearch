# PatternTokenizer

Flexible regex-based tokenization with split or capture modes.

## Import

```typescript
import PatternTokenizer from 'dynamosearch/tokenizers/PatternTokenizer';
```

## Constructor

```typescript
new PatternTokenizer(options?: { pattern?: RegExp; group?: number })
```

### Parameters

- **pattern** (`RegExp`, optional) - Regular expression pattern (default: `/\W+/`)
- **group** (`number`, optional) - Capture group to extract (default: `-1`)
  - `-1` = split mode (split on pattern matches)
  - `>= 0` = capture mode (extract matching groups)

## Examples

### Split Mode (Default)

```typescript
const tokenizer = new PatternTokenizer({ pattern: /\W+/ });
const tokens = await tokenizer.tokenize('hello-world_foo');
// [
//   { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'world', startOffset: 6, endOffset: 11, position: 1 },
//   { token: 'foo', startOffset: 12, endOffset: 15, position: 2 }
// ]
```

### Capture Mode

```typescript
const tokenizer = new PatternTokenizer({
  pattern: /\d+/g,
  group: 0,
});
const tokens = await tokenizer.tokenize('abc123def456');
// [
//   { token: '123', startOffset: 3, endOffset: 6, position: 0 },
//   { token: '456', startOffset: 9, endOffset: 12, position: 1 }
// ]
```

## Behavior

- Split mode: Splits text at pattern matches
- Capture mode: Extracts text matching pattern
- Highly flexible for custom tokenization

## Best For

- Custom tokenization patterns
- Complex text parsing
- Domain-specific formats

## See Also

- [SimplePatternTokenizer](./simple-pattern-tokenizer.md) - For simple pattern matching
- [SimplePatternSplitTokenizer](./simple-pattern-split-tokenizer.md) - For simple splitting
- [StandardTokenizer](./standard-tokenizer.md) - For standard word tokenization
