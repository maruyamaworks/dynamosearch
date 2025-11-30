# StopAnalyzer

Letter-based tokenization with lowercasing and stop word filtering.

## Import

```typescript
import StopAnalyzer from 'dynamosearch/analyzers/StopAnalyzer';
```

## Constructor

```typescript
new StopAnalyzer(options?: StopAnalyzerOptions)
```

### Parameters

- **stopWords** (`'_english_' | '_none_' | string[]`, optional) - Stop words to filter (default: `'_english_'`)

## Pipeline

- **Tokenizer**: `LowerCaseTokenizer`
- **Filters**: `StopFilter`

## Examples

### Default (English Stop Words)

```typescript
const analyzer = new StopAnalyzer();
const tokens = await analyzer.analyze('The quick brown fox');
// [
//   { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
//   { token: 'brown', startOffset: 10, endOffset: 15, position: 2 },
//   { token: 'fox', startOffset: 16, endOffset: 19, position: 3 }
// ]
```

### Custom Stop Words

```typescript
const analyzer = new StopAnalyzer({
  stopWords: ['quick', 'brown'],
});
const tokens = await analyzer.analyze('The quick brown fox');
// [
//   { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
//   { token: 'fox', startOffset: 16, endOffset: 19, position: 3 }
// ]
```

## Behavior

- Splits on non-letter characters
- Automatically converts to lowercase
- Removes configured stop words
- Default uses English stop words (the, a, an, and, or, but, etc.)

## Best For

- English text with stop word removal
- Reducing index size
- Improving search relevance

## See Also

- [StandardAnalyzer](./standard-analyzer.md) - For word-based tokenization with optional stop words
- [SimpleAnalyzer](./simple-analyzer.md) - For letter-based without stop words
- [EnglishAnalyzer](./english-analyzer.md) - For English with stemming and stop words
