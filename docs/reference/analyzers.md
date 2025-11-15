# Analyzers

Analyzers convert text into searchable tokens through a pipeline of character filters, tokenizer, and token filters.

## Base Analyzer

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer.js';
```

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