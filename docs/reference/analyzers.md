# Analyzers

Analyzers convert text into searchable tokens through a pipeline of character filters, tokenizer, and token filters.

## Base Analyzer

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer';
```

### Constructor

```typescript
new Analyzer(options: AnalyzerOptions)
```

Creates a custom analyzer with specified components.

**Parameters:**
- **tokenizer** (`Tokenizer`) - Tokenizer instance
- **charFilters** (`CharacterFilter[]`, optional) - Array of character filters
- **filters** (`TokenFilter[]`, optional) - Array of token filters

### analyze()

```typescript
analyze(str: string): Promise<{ text: string }[]>
```

Analyzes text and returns array of tokens.

**Parameters:**
- **str** (`string`) - Text to analyze

**Returns:** Promise resolving to array of token objects with `text` property

### Example

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';

const analyzer = new Analyzer({
  charFilters: [],
  tokenizer: new StandardTokenizer(),
  filters: [LowerCaseFilter()],
});

const tokens = await analyzer.analyze('Hello World!');
// [{ text: 'hello' }, { text: 'world' }]
```

## StandardAnalyzer

English text analyzer with word tokenization, lowercase normalization, and optional stop word filtering.

```typescript
import StandardAnalyzer from 'dynamosearch/analyzers/StandardAnalyzer';
```

### Constructor

```typescript
new StandardAnalyzer(options?: StandardAnalyzerOptions)
```

**Parameters:**
- **maxTokenLength** (`number`, optional) - Maximum token length before splitting (default: `255`)
- **stopWords** (`'_english_' | '_none_' | string[]`, optional) - Stop words to filter (default: `'_none_'`)

### Pipeline

- **Tokenizer**: `StandardTokenizer`
- **Filters**: `LowerCaseFilter`, `StopFilter`

### Usage

```typescript
const analyzer = new StandardAnalyzer();
const tokens = await analyzer.analyze('The Quick Brown Fox');
// [{ text: 'the' }, { text: 'quick' }, { text: 'brown' }, { text: 'fox' }]

// With stop words
const analyzerWithStops = new StandardAnalyzer({ stopWords: '_english_' });
const tokens2 = await analyzerWithStops.analyze('The Quick Brown Fox');
// [{ text: 'quick' }, { text: 'brown' }, { text: 'fox' }]
```

### Best For

- English text
- Western languages
- General text search

## SimpleAnalyzer

Letter-based tokenization with automatic lowercasing.

```typescript
import SimpleAnalyzer from 'dynamosearch/analyzers/SimpleAnalyzer';
```

### Constructor

```typescript
new SimpleAnalyzer()
```

**Parameters:** None

### Pipeline

- **Tokenizer**: `LowerCaseTokenizer`
- **Filters**: None

### Usage

```typescript
const analyzer = new SimpleAnalyzer();
const tokens = await analyzer.analyze('Hello-World123');
// [{ text: 'hello' }, { text: 'world' }]
```

### Best For

- Simple text tokenization
- When you only want letters
- Case-insensitive search without stop words

## WhitespaceAnalyzer

Splits text on whitespace characters.

```typescript
import WhitespaceAnalyzer from 'dynamosearch/analyzers/WhitespaceAnalyzer';
```

### Constructor

```typescript
new WhitespaceAnalyzer()
```

**Parameters:** None

### Pipeline

- **Tokenizer**: `WhitespaceTokenizer`
- **Filters**: None

### Usage

```typescript
const analyzer = new WhitespaceAnalyzer();
const tokens = await analyzer.analyze('hello-world foo_bar');
// [{ text: 'hello-world' }, { text: 'foo_bar' }]
```

### Best For

- Preserving punctuation and special characters
- Pre-tokenized input
- When whitespace is the only delimiter

## KeywordAnalyzer

Treats the entire input as a single token for exact matching.

```typescript
import KeywordAnalyzer from 'dynamosearch/analyzers/KeywordAnalyzer';
```

### Constructor

```typescript
new KeywordAnalyzer()
```

**Parameters:** None

### Pipeline

- **Tokenizer**: `KeywordTokenizer`
- **Filters**: None

### Usage

```typescript
const analyzer = new KeywordAnalyzer();
const tokens = await analyzer.analyze('product-123-abc');
// [{ text: 'product-123-abc' }]
```

### Best For

- IDs and identifiers
- Categories and tags
- Exact string matching
- Status values
- Enum-like fields

## StopAnalyzer

Letter-based tokenization with lowercasing and stop word filtering.

```typescript
import StopAnalyzer from 'dynamosearch/analyzers/StopAnalyzer';
```

### Constructor

```typescript
new StopAnalyzer(options?: StopAnalyzerOptions)
```

**Parameters:**
- **stopWords** (`'_english_' | '_none_' | string[]`, optional) - Stop words to filter (default: `'_english_'`)

### Pipeline

- **Tokenizer**: `LowerCaseTokenizer`
- **Filters**: `StopFilter`

### Usage

```typescript
const analyzer = new StopAnalyzer();
const tokens = await analyzer.analyze('The quick brown fox');
// [{ text: 'quick' }, { text: 'brown' }, { text: 'fox' }]

// With custom stop words
const customAnalyzer = new StopAnalyzer({
  stopWords: ['quick', 'brown'],
});
const tokens2 = await customAnalyzer.analyze('The quick brown fox');
// [{ text: 'the' }, { text: 'fox' }]
```

### Best For

- English text with stop word removal
- Reducing index size
- Improving search relevance

## PatternAnalyzer

Regex-based tokenization with optional lowercasing and stop word filtering.

```typescript
import PatternAnalyzer from 'dynamosearch/analyzers/PatternAnalyzer';
```

### Constructor

```typescript
new PatternAnalyzer(options?: PatternAnalyzerOptions)
```

**Parameters:**
- **pattern** (`RegExp`, optional) - Regular expression for tokenization (default: `/\W+/`)
- **lowercase** (`boolean`, optional) - Convert to lowercase (default: `true`)
- **stopWords** (`'_english_' | '_none_' | string[]`, optional) - Stop words to filter (default: `'_none_'`)

### Pipeline

- **Tokenizer**: `PatternTokenizer`
- **Filters**: `LowerCaseFilter` (if enabled), `StopFilter`

### Usage

```typescript
// Split on non-word characters
const analyzer = new PatternAnalyzer();
const tokens = await analyzer.analyze('email@example.com');
// [{ text: 'email' }, { text: 'example' }, { text: 'com' }]

// Custom pattern: split on dots
const dotAnalyzer = new PatternAnalyzer({ pattern: /\./ });
const tokens2 = await dotAnalyzer.analyze('com.example.app');
// [{ text: 'com' }, { text: 'example' }, { text: 'app' }]

// Case-sensitive
const caseAnalyzer = new PatternAnalyzer({ lowercase: false });
const tokens3 = await caseAnalyzer.analyze('HelloWorld');
// [{ text: 'HelloWorld' }]
```

### Best For

- Custom tokenization patterns
- Domain-specific text formats
- Structured identifiers
- Email addresses and URLs

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
  return tokens.map((token) => ({ text: token.text.toUpperCase() }));
};
```

### AnalyzerOptions

```typescript
interface AnalyzerOptions {
  tokenizer: Tokenizer;
  charFilters?: CharacterFilter[];
  filters?: TokenFilter[];
}
```

## Creating Custom Analyzers

### Basic Custom Analyzer

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer';
import WhitespaceTokenizer from 'dynamosearch/tokenizers/WhitespaceTokenizer';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';

class EmailAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [],
      tokenizer: new WhitespaceTokenizer(),
      filters: [LowerCaseFilter()],
    });
  }
}
```

### With Custom Filters

```typescript
import StopFilter from 'dynamosearch/filters/StopFilter';

const stopWords = ['the', 'a', 'an', 'and', 'or', 'but'];

class EnglishAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [],
      tokenizer: new StandardTokenizer(),
      filters: [LowerCaseFilter(), StopFilter({ stopWords })],
    });
  }
}
```

### With Character Filters

```typescript
import ICUNormalizer from 'dynamosearch/char_filters/ICUNormalizer';

const htmlStripFilter = (str: string) => str.replace(/<[^>]*>/g, '');
const whitespaceNormalizeFilter = (str: string) => str.replace(/\s+/g, ' ');

class HtmlAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [
        ICUNormalizer(),
        htmlStripFilter,
        whitespaceNormalizeFilter,
      ],
      tokenizer: new StandardTokenizer(),
      filters: [LowerCaseFilter()],
    });
  }
}
```
