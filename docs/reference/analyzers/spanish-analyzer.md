# SpanishAnalyzer

Optimized analyzer for Spanish text with stemming support.

## Import

```typescript
import SpanishAnalyzer from 'dynamosearch/analyzers/SpanishAnalyzer';
```

## Constructor

```typescript
new SpanishAnalyzer(options?: SpanishAnalyzerOptions)
```

### Parameters

- **stopWords** (`'_spanish_' | '_none_' | string[]`, optional) - Stop words to filter (default: `'_spanish_'`)

## Pipeline

- **CharFilters**: None
- **Tokenizer**: `StandardTokenizer`
- **Filters**: `LowerCaseFilter`, `StopFilter`, `SnowballFilter` (Spanish)

## Example

```typescript
const analyzer = new SpanishAnalyzer();
const tokens = await analyzer.analyze('Los gatos corriendo rápidamente');
// Applies Spanish stemming and removes Spanish stop words
```

## Behavior

- Converts to lowercase
- Removes Spanish stop words
- Applies Snowball Spanish stemming algorithm
- Handles Spanish-specific linguistic features

## Best For

- Spanish text search
- Spanish word stemming
- Removing Spanish stop words
- Improving search recall for Spanish content

## See Also

- [EnglishAnalyzer](./english-analyzer.md) - For English text
- [FrenchAnalyzer](./french-analyzer.md) - For French text
- [StandardAnalyzer](./standard-analyzer.md) - For general text
