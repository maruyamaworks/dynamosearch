# StandardAnalyzer

English text analyzer with word tokenization, lowercase normalization, and optional stop word filtering.

## Import

```typescript
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer';
```

## Constructor

```typescript
new StandardAnalyzer(options?: StandardAnalyzerOptions)
```

### Parameters

- **maxTokenLength** (`number`, optional) - Maximum token length before splitting (default: `255`)
- **stopWords** (`'_english_' | '_none_' | string[]`, optional) - Stop words to filter (default: `'_none_'`)

## Pipeline

- **Tokenizer**: `StandardTokenizer`
- **Filters**: `LowerCaseFilter`, `StopFilter`

## Examples

### Basic Usage

```typescript
const analyzer = new StandardAnalyzer();
const tokens = await analyzer.analyze('The Quick Brown Fox');
// [
//   { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
//   { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
//   { token: 'brown', startOffset: 10, endOffset: 15, position: 2 },
//   { token: 'fox', startOffset: 16, endOffset: 19, position: 3 }
// ]
```

### With Stop Words

```typescript
const analyzer = new StandardAnalyzer({ stopWords: '_english_' });
const tokens = await analyzer.analyze('The Quick Brown Fox');
// [
//   { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
//   { token: 'brown', startOffset: 10, endOffset: 15, position: 2 },
//   { token: 'fox', startOffset: 16, endOffset: 19, position: 3 }
// ]
```

## Best For

- English text
- Western languages
- General text search

## See Also

- [EnglishAnalyzer](./english-analyzer.md) - For English with stemming
- [StopAnalyzer](./stop-analyzer.md) - For letter-based tokenization with stop words
- [SimpleAnalyzer](./simple-analyzer.md) - For simpler letter-based tokenization
