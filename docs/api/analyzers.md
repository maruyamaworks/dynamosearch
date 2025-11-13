# Analyzers

Analyzers convert text into searchable tokens through a pipeline of character filters, tokenizer, and token filters.

## Base Analyzer

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer.js';
```

### Constructor

```typescript
new Analyzer(options: AnalyzerConstructorOptions)
```

**Parameters:**
- **tokenizer** (`Tokenizer`) - Tokenizer instance
- **charFilters** (`CharacterFilter[]`, optional) - Array of character filters
- **filters** (`TokenFilter[]`, optional) - Array of token filters

### getInstance()

```typescript
static async getInstance(options: AnalyzerOptions): Promise<Analyzer>
```

Factory method to create analyzer instance.

**Parameters:**
- **tokenizer** (`typeof Tokenizer`) - Tokenizer class
- **charFilters** (`CharacterFilter[]`, optional) - Array of character filters
- **filters** (`TokenFilter[]`, optional) - Array of token filters

### analyze()

```typescript
analyze(str: string): { text: string }[]
```

Analyzes text and returns array of tokens.

**Parameters:**
- **str** (`string`) - Text to analyze

**Returns:** Array of token objects with `text` property

### Example

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer.js';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer.js';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter.js';

class MyAnalyzer extends Analyzer {
  static async getInstance() {
    return new MyAnalyzer({
      charFilters: [],
      tokenizer: await StandardTokenizer.getInstance(),
      filters: [LowerCaseFilter()]
    });
  }
}

const analyzer = await MyAnalyzer.getInstance();
const tokens = analyzer.analyze('Hello World!');
// [{ text: 'hello' }, { text: 'world' }]
```

## StandardAnalyzer

English text analyzer with word tokenization and lowercase normalization.

```typescript
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer.js';
```

### Pipeline

- **Tokenizer**: `StandardTokenizer`
- **Filters**: `LowerCaseFilter`

### Usage

```typescript
const analyzer = await StandardAnalyzer.getInstance();
const tokens = analyzer.analyze('The Quick Brown Fox');
// [{ text: 'the' }, { text: 'quick' }, { text: 'brown' }, { text: 'fox' }]
```

### Best For

- English text
- Western languages
- General text search

## KeywordAnalyzer

Treats the entire input as a single token for exact matching.

```typescript
import KeywordAnalyzer from 'dynamosearch/analyzers/KeywordAnalyzer.js';
```

### Pipeline

- **Tokenizer**: `KeywordTokenizer`
- **Filters**: None

### Usage

```typescript
const analyzer = await KeywordAnalyzer.getInstance();
const tokens = analyzer.analyze('product-123-abc');
// [{ text: 'product-123-abc' }]
```

### Best For

- IDs and identifiers
- Categories and tags
- Exact string matching
- Status values
- Enum-like fields

## JapaneseAnalyzer (Plugin)

Japanese text analyzer using Kuromoji morphological analysis.

```typescript
import JapaneseAnalyzer from '@dynamosearch/plugin-analysis-kuromoji/analyzers/JapaneseAnalyzer.js';
```

### Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

### Pipeline

- **Tokenizer**: `KuromojiTokenizer`
- **Filters**: `LowerCaseFilter`, `CJKWidthFilter`

### Usage

```typescript
const analyzer = await JapaneseAnalyzer.getInstance();
const tokens = analyzer.analyze('東京タワーに行きました');
// [
//   { text: '東京' },
//   { text: 'タワー' },
//   { text: 'に' },
//   { text: '行き' },
//   { text: 'まし' },
//   { text: 'た' }
// ]
```

### Best For

- Japanese text
- Mixed Japanese/English content
- Japanese search applications

## Type Definitions

### CharacterFilter

```typescript
type CharacterFilter = (str: string) => string;
```

Function that transforms input string.

**Example:**

```typescript
const htmlStripFilter: CharacterFilter = (str) => {
  return str.replace(/<[^>]*>/g, '');
};
```

### TokenFilter

```typescript
type TokenFilter = (tokens: { text: string }[]) => { text: string }[];
```

Function that transforms or filters token array.

**Example:**

```typescript
const uppercaseFilter: TokenFilter = (tokens) => {
  return tokens.map(token => ({ text: token.text.toUpperCase() }));
};
```

### AnalyzerOptions

```typescript
interface AnalyzerOptions {
  tokenizer: typeof Tokenizer;
  charFilters?: CharacterFilter[];
  filters?: TokenFilter[];
}
```

## Creating Custom Analyzers

### Basic Custom Analyzer

```typescript
class EmailAnalyzer extends Analyzer {
  static async getInstance() {
    return new EmailAnalyzer({
      charFilters: [],
      tokenizer: await EmailTokenizer.getInstance(),
      filters: [LowerCaseFilter()]
    });
  }
}
```

### With Custom Filters

```typescript
const stopWords = ['the', 'a', 'an', 'and', 'or', 'but'];
const stopWordsFilter: TokenFilter = (tokens) => {
  return tokens.filter(t => !stopWords.includes(t.text.toLowerCase()));
};

class EnglishAnalyzer extends Analyzer {
  static async getInstance() {
    return new EnglishAnalyzer({
      charFilters: [],
      tokenizer: await StandardTokenizer.getInstance(),
      filters: [
        LowerCaseFilter(),
        stopWordsFilter
      ]
    });
  }
}
```

### With Character Filters

```typescript
const htmlStripFilter = (str: string) => str.replace(/<[^>]*>/g, '');
const whitespaceNormalizeFilter = (str: string) => str.replace(/\s+/g, ' ');

class HtmlAnalyzer extends Analyzer {
  static async getInstance() {
    return new HtmlAnalyzer({
      charFilters: [
        htmlStripFilter,
        whitespaceNormalizeFilter
      ],
      tokenizer: await StandardTokenizer.getInstance(),
      filters: [LowerCaseFilter()]
    });
  }
}
```

## Analyzer Selection Guide

| Content Type | Recommended Analyzer | Notes |
|--------------|---------------------|-------|
| English text | `StandardAnalyzer` | Default choice for Western languages |
| Japanese text | `JapaneseAnalyzer` | Requires plugin installation |
| IDs/codes | `KeywordAnalyzer` | Exact matching only |
| Email addresses | Custom with email tokenizer | Extract email addresses |
| URLs | Custom with URL tokenizer | Extract and parse URLs |
| File paths | Custom with `PathHierarchyTokenizer` | Hierarchical matching |
| Code/camelCase | Custom with camelCase filter | Split camelCase identifiers |
| Product descriptions | `StandardAnalyzer` with stop words | Remove common words |

## Performance Tips

1. **Reuse analyzer instances** - Create once, use many times
2. **Avoid expensive operations** - No API calls in filters
3. **Cache compiled regexes** - Don't recreate patterns
4. **Keep filters simple** - Complex logic slows indexing
5. **Test with real data** - Validate performance at scale

## See Also

- [Text Analysis Guide](/guide/text-analysis) - Comprehensive guide
- [Custom Analyzers Guide](/guide/custom-analyzers) - Build custom analyzers
- [Tokenizers API](/api/tokenizers) - Available tokenizers
- [Filters API](/api/filters) - Available filters
