# EnglishAnalyzer

Optimized analyzer for English text with stemming and stop word filtering.

## Import

```typescript
import EnglishAnalyzer from 'dynamosearch/analyzers/EnglishAnalyzer';
```

## Constructor

```typescript
new EnglishAnalyzer(options?: EnglishAnalyzerOptions)
```

### Parameters

- **stopWords** (`'_english_' | '_none_' | string[]`, optional) - Stop words to filter (default: `'_english_'`)
- **stemmer** (`'porter' | 'english' | 'none'`, optional) - Stemming algorithm to use (default: `'porter'`)

## Pipeline

- **CharFilters**: None
- **Tokenizer**: `StandardTokenizer`
- **Filters**: `LowerCaseFilter`, `StopFilter`, `EnglishPossessiveFilter`, `PorterStemFilter` (or `SnowballFilter` with English)

## Example

```typescript
const analyzer = new EnglishAnalyzer();
const tokens = await analyzer.analyze('The running foxes');
// [
//   { token: 'run', startOffset: 4, endOffset: 11, position: 1 },
//   { token: 'fox', startOffset: 12, endOffset: 17, position: 2 }
// ]
```

## Behavior

- Removes English possessives ("'s")
- Converts to lowercase
- Removes English stop words
- Applies stemming to reduce words to root form
- Handles word variants (run, runs, running → run)

## Stemming Options

### Porter Stemmer (Default)

```typescript
const analyzer = new EnglishAnalyzer({ stemmer: 'porter' });
```

### Snowball English Stemmer

```typescript
const analyzer = new EnglishAnalyzer({ stemmer: 'english' });
```

### No Stemming

```typescript
const analyzer = new EnglishAnalyzer({ stemmer: 'none' });
```

## Best For

- English text search with stemming
- Handling English word variations (run, runs, running)
- Removing English stop words
- Improving search recall for English content

## See Also

- [StandardAnalyzer](./standard-analyzer.md) - For English without stemming
- [StopAnalyzer](./stop-analyzer.md) - For letter-based with stop words
- [FrenchAnalyzer](./french-analyzer.md) - For French text
- [SpanishAnalyzer](./spanish-analyzer.md) - For Spanish text
