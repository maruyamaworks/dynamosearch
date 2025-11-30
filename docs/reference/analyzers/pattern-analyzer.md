# PatternAnalyzer

Regex-based tokenization with optional lowercasing and stop word filtering.

## Import

```typescript
import PatternAnalyzer from 'dynamosearch/analyzers/PatternAnalyzer';
```

## Constructor

```typescript
new PatternAnalyzer(options?: PatternAnalyzerOptions)
```

### Parameters

- **pattern** (`RegExp`, optional) - Regular expression for tokenization (default: `/\W+/`)
- **lowercase** (`boolean`, optional) - Convert to lowercase (default: `true`)
- **stopWords** (`'_english_' | '_none_' | string[]`, optional) - Stop words to filter (default: `'_none_'`)

## Pipeline

- **Tokenizer**: `PatternTokenizer`
- **Filters**: `LowerCaseFilter` (if enabled), `StopFilter`

## Examples

### Default Pattern (Non-word Characters)

```typescript
const analyzer = new PatternAnalyzer();
const tokens = await analyzer.analyze('email@example.com');
// [
//   { token: 'email', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'example', startOffset: 6, endOffset: 13, position: 1 },
//   { token: 'com', startOffset: 14, endOffset: 17, position: 2 }
// ]
```

### Custom Pattern (Split on Dots)

```typescript
const analyzer = new PatternAnalyzer({ pattern: /\./ });
const tokens = await analyzer.analyze('com.example.app');
// [
//   { token: 'com', startOffset: 0, endOffset: 3, position: 0 },
//   { token: 'example', startOffset: 4, endOffset: 11, position: 1 },
//   { token: 'app', startOffset: 12, endOffset: 15, position: 2 }
// ]
```

### Case-Sensitive Mode

```typescript
const analyzer = new PatternAnalyzer({ lowercase: false });
const tokens = await analyzer.analyze('HelloWorld');
// [{ token: 'HelloWorld', startOffset: 0, endOffset: 10, position: 0 }]
```

## Behavior

- Splits text at pattern matches
- Default pattern splits on non-word characters (`/\W+/`)
- Optionally converts to lowercase
- Optionally filters stop words

## Best For

- Custom tokenization patterns
- Domain-specific text formats
- Structured identifiers
- Email addresses and URLs

## See Also

- [StandardAnalyzer](./standard-analyzer.md) - For standard word-based tokenization
- [WhitespaceAnalyzer](./whitespace-analyzer.md) - For whitespace-only splitting
