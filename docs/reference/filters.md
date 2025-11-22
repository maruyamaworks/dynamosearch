# Token Filters

Token filters transform or remove tokens after tokenization.

## Type Definition

```typescript
type TokenFilter = (tokens: { text: string }[]) => { text: string }[];
```

Token filters are functions that receive an array of tokens and return a transformed array.

## LowerCaseFilter

Converts all tokens to lowercase.

```typescript
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';
```

### Usage

```typescript
const filter = LowerCaseFilter();
const tokens = filter([
  { text: 'Hello' },
  { text: 'WORLD' },
  { text: 'JavaScript' },
]);
// [
//   { text: 'hello' },
//   { text: 'world' },
//   { text: 'javascript' }
// ]
```

### Best For

- Case-insensitive search
- Normalizing English text
- Most text search applications

## UpperCaseFilter

Converts all tokens to uppercase.

```typescript
import UpperCaseFilter from 'dynamosearch/filters/UpperCaseFilter';
```

### Usage

```typescript
const filter = UpperCaseFilter();
const tokens = filter([
  { text: 'hello' },
  { text: 'world' },
  { text: 'JavaScript' },
]);
// [
//   { text: 'HELLO' },
//   { text: 'WORLD' },
//   { text: 'JAVASCRIPT' }
// ]
```

### Best For

- Uppercase normalization
- Legacy system integration
- Special display requirements

## CJKWidthFilter

Normalizes CJK (Chinese, Japanese, Korean) character widths.

```typescript
import CJKWidthFilter from 'dynamosearch/filters/CJKWidthFilter';
```

### Usage

```typescript
const filter = CJKWidthFilter();
const tokens = filter([
  { text: 'ＡＢＣ' }, // Full-width
  { text: 'ａｂｃ' }, // Full-width
  { text: '１２３' }, // Full-width
]);
// [
//   { text: 'ABC' },    // Half-width
//   { text: 'abc' },    // Half-width
//   { text: '123' }     // Half-width
// ]
```

### Conversions

- Half-width katakana → Full-width katakana
- Full-width alphanumeric → Half-width alphanumeric

### Best For

- Japanese text search
- Mixed Japanese/English content
- CJK text normalization

## StopFilter

Removes stop words from the token stream.

```typescript
import StopFilter from 'dynamosearch/filters/StopFilter';
```

### Constructor

```typescript
StopFilter(options?: { stopWords?: '_english_' | '_none_' | string[] })
```

**Parameters:**
- **stopWords** (`'_english_' | '_none_' | string[]`, optional) - Stop words to remove (default: `'_english_'`)

### Usage

```typescript
// Built-in English stop words
const filter = StopFilter({ stopWords: '_english_' });
const tokens = filter([
  { text: 'the' },
  { text: 'quick' },
  { text: 'brown' },
  { text: 'fox' },
]);
// [{ text: 'quick' }, { text: 'brown' }, { text: 'fox' }]

// Custom stop words
const customFilter = StopFilter({ stopWords: ['quick', 'brown'] });
const tokens2 = customFilter([
  { text: 'the' },
  { text: 'quick' },
  { text: 'brown' },
  { text: 'fox' },
]);
// [{ text: 'the' }, { text: 'fox' }]

// No stop words
const noFilter = StopFilter({ stopWords: '_none_' });
```

### Available Stop Word Lists

- **_english_** - Common English stop words (the, a, an, and, or, but, etc.)
- **_none_** - Empty list (no filtering)
- **Custom array** - Your own list of stop words

### Best For

- English text search
- Reducing index size
- Improving search relevance
- Filtering common words

## LengthFilter

Filters out tokens outside a specified length range.

```typescript
import LengthFilter from 'dynamosearch/filters/LengthFilter';
```

### Constructor

```typescript
LengthFilter(options?: { min?: number; max?: number })
```

**Parameters:**
- **min** (`number`, optional) - Minimum character length (default: `0`)
- **max** (`number`, optional) - Maximum character length (default: `2147483647`)

### Usage

```typescript
const filter = LengthFilter({ min: 3, max: 20 });
const tokens = filter([
  { text: 'hi' }, // Too short
  { text: 'hello' }, // OK
  { text: 'a' }, // Too short
  { text: 'verylongwordthatexceedslimit' }, // Too long
]);
// [{ text: 'hello' }]
```

### Best For

- Removing very short tokens
- Limiting token length
- Quality filtering

## TruncateFilter

Truncates tokens exceeding a specified length.

```typescript
import TruncateFilter from 'dynamosearch/filters/TruncateFilter';
```

### Constructor

```typescript
TruncateFilter(options?: { length?: number })
```

**Parameters:**
- **length** (`number`, optional) - Maximum character length (default: `10`)

### Usage

```typescript
const filter = TruncateFilter({ length: 5 });
const tokens = filter([
  { text: 'hello' }, // 5 chars - unchanged
  { text: 'world' }, // 5 chars - unchanged
  { text: 'truncate' }, // 8 chars - truncated
]);
// [
//   { text: 'hello' },
//   { text: 'world' },
//   { text: 'trunc' }
// ]
```

### Best For

- Limiting token length
- Storage optimization
- Prefix matching

## LimitTokenCountFilter

Limits the total number of tokens output.

```typescript
import LimitTokenCountFilter from 'dynamosearch/filters/LimitTokenCountFilter';
```

### Constructor

```typescript
LimitTokenCountFilter(options?: { maxTokenCount?: number })
```

**Parameters:**
- **maxTokenCount** (`number`, optional) - Maximum number of tokens to keep (default: `1`)

### Usage

```typescript
const filter = LimitTokenCountFilter({ maxTokenCount: 3 });
const tokens = filter([
  { text: 'first' },
  { text: 'second' },
  { text: 'third' },
  { text: 'fourth' },
  { text: 'fifth' },
]);
// [
//   { text: 'first' },
//   { text: 'second' },
//   { text: 'third' }
// ]
```

### Best For

- Limiting index size
- Taking first N tokens
- Title/heading analysis

## ReverseStringFilter

Reverses each token character-by-character.

```typescript
import ReverseStringFilter from 'dynamosearch/filters/ReverseStringFilter';
```

### Usage

```typescript
const filter = ReverseStringFilter();
const tokens = filter([
  { text: 'hello' },
  { text: 'world' },
]);
// [
//   { text: 'olleh' },
//   { text: 'dlrow' }
// ]
```

### Best For

- Suffix matching
- Reverse wildcard search
- Specialized search patterns

## PorterStemFilter

Applies Porter stemming algorithm for English.

```typescript
import PorterStemFilter from 'dynamosearch/filters/PorterStemFilter';
```

### Usage

```typescript
const filter = PorterStemFilter();
const tokens = filter([
  { text: 'running' },
  { text: 'runs' },
  { text: 'ran' },
  { text: 'runner' },
]);
// [
//   { text: 'run' },
//   { text: 'run' },
//   { text: 'ran' },
//   { text: 'runner' }
// ]
```

### Best For

- English text search
- Finding word variants
- Improving recall
- Reducing index size

## SnowballFilter

Applies Snowball stemming algorithm for multiple languages.

```typescript
import SnowballFilter from 'dynamosearch/filters/SnowballFilter';
```

### Constructor

```typescript
SnowballFilter(options?: { language?: string })
```

**Parameters:**
- **language** (`string`, optional) - Stemmer language (default: `'English'`)

### Supported Languages

- Arabic, Armenian, Basque, Catalan, Danish, Dutch, DutchPorter, English
- Esperanto, Estonian, Finnish, French, German, Greek, Hindi, Hungarian
- Indonesian, Irish, Italian, Lithuanian, Nepali, Norwegian, Polish, Porter
- Portuguese, Romanian, Russian, Serbian, Spanish, Swedish, Tamil, Turkish, Yiddish

### Usage

```typescript
// English
const enFilter = SnowballFilter({ language: 'English' });
const tokens1 = enFilter([
  { text: 'running' },
  { text: 'runs' },
  { text: 'runner' },
]);
// [{ text: 'run' }, { text: 'run' }, { text: 'runner' }]

// French
const frFilter = SnowballFilter({ language: 'French' });
const tokens2 = frFilter([
  { text: 'chevaux' },
  { text: 'cheval' },
]);
// [{ text: 'cheval' }, { text: 'cheval' }]

// Spanish
const esFilter = SnowballFilter({ language: 'Spanish' });
const tokens3 = esFilter([
  { text: 'corriendo' },
  { text: 'correr' },
]);
// [{ text: 'corr' }, { text: 'corr' }]
```

### Best For

- Multilingual search
- Finding word variants
- Improving recall across languages
- Normalizing word forms

## TrimFilter

Removes leading and trailing whitespace from tokens.

```typescript
import TrimFilter from 'dynamosearch/filters/TrimFilter';
```

### Usage

```typescript
const filter = TrimFilter();
const tokens = filter([
  { text: '  hello  ' },
  { text: 'world\t' },
  { text: '\n test ' },
]);
// [
//   { text: 'hello' },
//   { text: 'world' },
//   { text: 'test' }
// ]
```

### Best For

- Cleaning whitespace from tokens
- Normalizing text input
- Processing user input

## UniqueFilter

Removes duplicate tokens from the token stream.

```typescript
import UniqueFilter from 'dynamosearch/filters/UniqueFilter';
```

### Usage

```typescript
const filter = UniqueFilter();
const tokens = filter([
  { text: 'hello' },
  { text: 'world' },
  { text: 'hello' }, // Duplicate
  { text: 'world' }, // Duplicate
]);
// [{ text: 'hello' }, { text: 'world' }]
```

### Best For

- Removing duplicate tokens
- Reducing index size
- Deduplicating n-gram output

## ASCIIFoldingFilter

Converts accented characters to their ASCII equivalents.

```typescript
import ASCIIFoldingFilter from 'dynamosearch/filters/ASCIIFoldingFilter';
```

### Usage

```typescript
const filter = ASCIIFoldingFilter();
const tokens = filter([
  { text: 'café' },
  { text: 'résumé' },
  { text: 'naïve' },
  { text: 'Zürich' },
]);
// [
//   { text: 'cafe' },
//   { text: 'resume' },
//   { text: 'naive' },
//   { text: 'Zurich' }
// ]
```

### Best For

- Normalizing international text
- Language-agnostic search
- Handling user input with accents
- Improving search recall

## Custom Filters

### Synonym Filter

Replace words with synonyms:

```typescript
const synonymFilter = (synonyms: Record<string, string>): TokenFilter => {
  return (tokens) =>
    tokens.map((token) => ({
      text: synonyms[token.text.toLowerCase()] || token.text,
    }));
};

// Usage
const productSynonyms = {
  tv: 'television',
  pc: 'computer',
  phone: 'smartphone',
};

const filter = synonymFilter(productSynonyms);
const tokens = filter([{ text: 'tv' }, { text: 'pc' }]);
// [{ text: 'television' }, { text: 'computer' }]
```

### Simple Stem Filter

Basic English stemming:

```typescript
const simpleStemFilter = (): TokenFilter => {
  const rules: [RegExp, string][] = [
    [/ies$/, 'y'], // berries → berry
    [/es$/, ''], // boxes → box
    [/s$/, ''], // cats → cat
    [/ing$/, ''], // running → runn
    [/ed$/, ''], // walked → walk
  ];

  return (tokens) =>
    tokens.map((token) => {
      let text = token.text;
      for (const [pattern, replacement] of rules) {
        if (pattern.test(text)) {
          text = text.replace(pattern, replacement);
          break;
        }
      }
      return { text };
    });
};
```

### Word Delimiter Filter

Split tokens on delimiters:

```typescript
const wordDelimiterFilter = (): TokenFilter => {
  return (tokens) => {
    const result: { text: string }[] = [];
    for (const token of tokens) {
      const parts = token.text.split(/[-_]/);
      result.push(...parts.map((text) => ({ text })));
    }
    return result;
  };
};

// Usage
const filter = wordDelimiterFilter();
const tokens = filter([{ text: 'hello-world_foo' }]);
// [{ text: 'hello' }, { text: 'world' }, { text: 'foo' }]
```

## Filter Chains

Combine multiple filters:

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';
import StopFilter from 'dynamosearch/filters/StopFilter';
import LengthFilter from 'dynamosearch/filters/LengthFilter';

class CustomAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [],
      tokenizer: new StandardTokenizer(),
      filters: [
        LowerCaseFilter(),
        StopFilter({ stopWords: '_english_' }),
        LengthFilter({ min: 3, max: 20 }),
        PorterStemFilter(),
      ],
    });
  }
}
```
