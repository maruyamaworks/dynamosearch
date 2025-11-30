# SnowballFilter

Applies Snowball stemming algorithm for multiple languages.

## Import

```typescript
import SnowballFilter from 'dynamosearch/filters/SnowballFilter';
```

## Constructor

```typescript
new SnowballFilter(options?: { language?: string })
```

### Parameters

- **language** (`string`, optional) - Stemmer language (default: `'English'`)

## Supported Languages

Arabic, Armenian, Basque, Catalan, Danish, Dutch, DutchPorter, English, Esperanto, Estonian, Finnish, French, German, Greek, Hindi, Hungarian, Indonesian, Irish, Italian, Lithuanian, Nepali, Norwegian, Polish, Porter, Portuguese, Romanian, Russian, Serbian, Spanish, Swedish, Tamil, Turkish, Yiddish

## Examples

### English

```typescript
const filter = new SnowballFilter({ language: 'English' });
const tokens = filter.apply([
  { token: 'running', startOffset: 0, endOffset: 7, position: 0 },
  { token: 'runs', startOffset: 8, endOffset: 12, position: 1 },
  { token: 'runner', startOffset: 13, endOffset: 19, position: 2 },
]);
// [
//   { token: 'run', startOffset: 0, endOffset: 7, position: 0 },
//   { token: 'run', startOffset: 8, endOffset: 12, position: 1 },
//   { token: 'runner', startOffset: 13, endOffset: 19, position: 2 }
// ]
```

### French

```typescript
const filter = new SnowballFilter({ language: 'French' });
const tokens = filter.apply([
  { token: 'chevaux', startOffset: 0, endOffset: 7, position: 0 },
  { token: 'cheval', startOffset: 8, endOffset: 14, position: 1 },
]);
// [
//   { token: 'cheval', startOffset: 0, endOffset: 7, position: 0 },
//   { token: 'cheval', startOffset: 8, endOffset: 14, position: 1 }
// ]
```

### Spanish

```typescript
const filter = new SnowballFilter({ language: 'Spanish' });
const tokens = filter.apply([
  { token: 'corriendo', startOffset: 0, endOffset: 9, position: 0 },
  { token: 'correr', startOffset: 10, endOffset: 16, position: 1 },
]);
// [
//   { token: 'corr', startOffset: 0, endOffset: 9, position: 0 },
//   { token: 'corr', startOffset: 10, endOffset: 16, position: 1 }
// ]
```

## Best For

- Multilingual search
- Finding word variants
- Improving recall across languages
- Normalizing word forms

## See Also

- [PorterStemFilter](./porter-stem-filter.md) - For English-only stemming
- [FrenchAnalyzer](/reference/analyzers/french-analyzer.md) - Uses this filter for French
- [SpanishAnalyzer](/reference/analyzers/spanish-analyzer.md) - Uses this filter for Spanish
