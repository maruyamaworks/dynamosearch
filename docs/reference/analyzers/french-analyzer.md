# FrenchAnalyzer

Optimized analyzer for French text with elision and stemming support.

## Import

```typescript
import FrenchAnalyzer from 'dynamosearch/analyzers/FrenchAnalyzer';
```

## Constructor

```typescript
new FrenchAnalyzer(options?: FrenchAnalyzerOptions)
```

### Parameters

- **stopWords** (`'_french_' | '_none_' | string[]`, optional) - Stop words to filter (default: `'_french_'`)

## Pipeline

- **CharFilters**: None
- **Tokenizer**: `StandardTokenizer`
- **Filters**: `LowerCaseFilter`, `ElisionFilter`, `StopFilter`, `SnowballFilter` (French)

## Example

```typescript
const analyzer = new FrenchAnalyzer();
const tokens = await analyzer.analyze("L'analyse du texte français");
// Handles French elisions (l', d') and applies French stemming
```

## Behavior

- Removes French elisions (l', d', qu', etc.)
- Converts to lowercase
- Removes French stop words
- Applies Snowball French stemming algorithm
- Handles French-specific linguistic features

## Best For

- French text search
- Handling French elisions
- French word stemming
- Improving search recall for French content

## See Also

- [EnglishAnalyzer](./english-analyzer.md) - For English text
- [SpanishAnalyzer](./spanish-analyzer.md) - For Spanish text
- [StandardAnalyzer](./standard-analyzer.md) - For general text
