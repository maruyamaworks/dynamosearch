# Token Filters

Token filters transform or remove tokens after tokenization.

## Type Definition

```typescript
type TokenFilter = (tokens: { text: string }[]) => { text: string }[];
```

## LowerCaseFilter

Converts all tokens to lowercase.

```typescript
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter.js';
```

### Usage

```typescript
const filter = LowerCaseFilter();
const tokens = filter([
  { text: 'Hello' },
  { text: 'WORLD' },
  { text: 'JavaScript' }
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

## CJKWidthFilter

Normalizes CJK (Chinese, Japanese, Korean) character widths.

```typescript
import CJKWidthFilter from 'dynamosearch/filters/CJKWidthFilter.js';
```

### Usage

```typescript
const filter = CJKWidthFilter();
const tokens = filter([
  { text: 'ＡＢＣ' },  // Full-width
  { text: 'ａｂｃ' },  // Full-width
  { text: '１２３' }   // Full-width
]);
// [
//   { text: 'ABC' },    // Half-width
//   { text: 'abc' },    // Half-width
//   { text: '123' }     // Half-width
// ]
```

### Conversions

- Full-width → Half-width Latin letters
- Full-width → Half-width digits
- Full-width → Half-width punctuation
- Katakana normalization

### Best For

- Japanese text search
- Mixed Japanese/English content
- CJK text normalization

## Custom Filters

### Stop Words Filter

Remove common words:

```typescript
const stopWordsFilter = (stopWords: string[]): TokenFilter => {
  const stopWordsSet = new Set(stopWords.map(w => w.toLowerCase()));
  return (tokens) => tokens.filter(
    token => !stopWordsSet.has(token.text.toLowerCase())
  );
};

// Usage
const englishStopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on'];
const filter = stopWordsFilter(englishStopWords);

const tokens = filter([
  { text: 'the' },
  { text: 'quick' },
  { text: 'brown' },
  { text: 'fox' }
]);
// [{ text: 'quick' }, { text: 'brown' }, { text: 'fox' }]
```

### Length Filter

Keep tokens within length range:

```typescript
const lengthFilter = (min: number, max?: number): TokenFilter => {
  return (tokens) => tokens.filter(token => {
    const len = token.text.length;
    return len >= min && (!max || len <= max);
  });
};

// Usage
const filter = lengthFilter(3, 20);
const tokens = filter([
  { text: 'hi' },      // Too short
  { text: 'hello' },   // OK
  { text: 'a' },       // Too short
  { text: 'verylongwordthatexceedslimit' }  // Too long
]);
// [{ text: 'hello' }]
```

### Unique Filter

Remove duplicate tokens:

```typescript
const uniqueFilter = (): TokenFilter => {
  return (tokens) => {
    const seen = new Set<string>();
    return tokens.filter(token => {
      if (seen.has(token.text)) {
        return false;
      }
      seen.add(token.text);
      return true;
    });
  };
};

// Usage
const filter = uniqueFilter();
const tokens = filter([
  { text: 'hello' },
  { text: 'world' },
  { text: 'hello' },  // Duplicate
  { text: 'world' }   // Duplicate
]);
// [{ text: 'hello' }, { text: 'world' }]
```

### Uppercase Filter

Convert to uppercase:

```typescript
const uppercaseFilter = (): TokenFilter => {
  return (tokens) => tokens.map(token => ({
    text: token.text.toUpperCase()
  }));
};
```

### ASCII Folding Filter

Convert accented characters to ASCII:

```typescript
const asciiFoldingFilter = (): TokenFilter => {
  return (tokens) => tokens.map(token => ({
    text: token.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }));
};

// Usage
const filter = asciiFoldingFilter();
const tokens = filter([
  { text: 'café' },
  { text: 'résumé' },
  { text: 'naïve' }
]);
// [
//   { text: 'cafe' },
//   { text: 'resume' },
//   { text: 'naive' }
// ]
```

### Stemming Filter (Simple)

Basic English stemming:

```typescript
const simpleStemFilter = (): TokenFilter => {
  const rules: [RegExp, string][] = [
    [/ies$/, 'y'],   // berries → berry
    [/es$/, ''],     // boxes → box
    [/s$/, ''],      // cats → cat
    [/ing$/, ''],    // running → runn
    [/ed$/, '']      // walked → walk
  ];

  return (tokens) => tokens.map(token => {
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

### Synonym Filter

Replace words with synonyms:

```typescript
const synonymFilter = (synonyms: Record<string, string>): TokenFilter => {
  return (tokens) => tokens.map(token => ({
    text: synonyms[token.text.toLowerCase()] || token.text
  }));
};

// Usage
const productSynonyms = {
  'tv': 'television',
  'pc': 'computer',
  'phone': 'smartphone'
};

const filter = synonymFilter(productSynonyms);
const tokens = filter([
  { text: 'tv' },
  { text: 'pc' }
]);
// [{ text: 'television' }, { text: 'computer' }]
```

### Trim Filter

Remove leading/trailing whitespace:

```typescript
const trimFilter = (): TokenFilter => {
  return (tokens) => tokens
    .map(token => ({ text: token.text.trim() }))
    .filter(token => token.text.length > 0);
};
```

## Filter Chains

Combine multiple filters:

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer.js';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer.js';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter.js';

class CustomAnalyzer extends Analyzer {
  static async getInstance() {
    const stopWords = ['the', 'a', 'an'];

    return new CustomAnalyzer({
      charFilters: [
        htmlStripFilter,
        whitespaceNormalizer
      ],
      tokenizer: await StandardTokenizer.getInstance(),
      filters: [
        LowerCaseFilter(),
        stopWordsFilter(stopWords),
        lengthFilter(3, 20),
        uniqueFilter()
      ]
    });
  }
}
```