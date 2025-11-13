# Filters

Filters transform text (character filters) or tokens (token filters) during analysis.

## Character Filters

Character filters preprocess raw text before tokenization.

### Type Definition

```typescript
type CharacterFilter = (str: string) => string;
```

Character filters are simple functions that transform strings.

### Example

```typescript
const htmlStripFilter: CharacterFilter = (str) => {
  return str.replace(/<[^>]*>/g, '');
};

const result = htmlStripFilter('<p>Hello <strong>World</strong></p>');
// 'Hello World'
```

## Token Filters

Token filters transform or remove tokens after tokenization.

### Type Definition

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

## Custom Character Filters

### HTML Strip Filter

Remove HTML tags:

```typescript
const htmlStripFilter: CharacterFilter = (str) => {
  return str.replace(/<[^>]*>/g, '');
};
```

### Pattern Replace Filter

Replace patterns in text:

```typescript
const patternReplaceFilter = (
  pattern: RegExp,
  replacement: string
): CharacterFilter => {
  return (str) => str.replace(pattern, replacement);
};

// Usage: Normalize phone numbers
const phoneNormalizer = patternReplaceFilter(/[()-\s]/g, '');
phoneNormalizer('(555) 123-4567');  // '5551234567'
```

### Mapping Filter

Map characters to replacements:

```typescript
const mappingFilter = (mappings: Record<string, string>): CharacterFilter => {
  return (str) => {
    let result = str;
    for (const [from, to] of Object.entries(mappings)) {
      result = result.replaceAll(from, to);
    }
    return result;
  };
};

// Usage: Normalize special characters
const specialCharMapper = mappingFilter({
  '©': '(c)',
  '®': '(r)',
  '™': '(tm)',
  '&': 'and'
});
```

### Whitespace Normalizer

Normalize whitespace:

```typescript
const whitespaceNormalizer: CharacterFilter = (str) => {
  return str.replace(/\s+/g, ' ').trim();
};

whitespaceNormalizer('hello    world\n\tfoo');
// 'hello world foo'
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

## Performance Tips

### Avoid Expensive Operations

```typescript
// ❌ Slow: API calls
const badFilter: TokenFilter = async (tokens) => {
  return await Promise.all(tokens.map(async token => ({
    text: await fetch(`/api/normalize?text=${token.text}`)
  })));
};

// ✅ Fast: Local processing
const goodFilter: TokenFilter = (tokens) => {
  return tokens.map(token => ({
    text: token.text.toLowerCase()
  }));
};
```

### Cache Expensive Computations

```typescript
// ❌ Slow: Recompile regex
const badFilter: CharacterFilter = (str) => {
  return str.replace(new RegExp('pattern', 'g'), 'replacement');
};

// ✅ Fast: Compile once
const pattern = /pattern/g;
const goodFilter: CharacterFilter = (str) => {
  return str.replace(pattern, 'replacement');
};
```

### Use Sets for Lookups

```typescript
// ❌ Slow: Array includes
const stopWords = ['the', 'a', 'an', ...];
const badFilter: TokenFilter = (tokens) => {
  return tokens.filter(t => !stopWords.includes(t.text));
};

// ✅ Fast: Set lookup
const stopWordsSet = new Set(['the', 'a', 'an', ...]);
const goodFilter: TokenFilter = (tokens) => {
  return tokens.filter(t => !stopWordsSet.has(t.text));
};
```

## Testing Filters

```typescript
const filter = LowerCaseFilter();

const testCases = [
  [{ text: 'HELLO' }],
  [{ text: 'World' }],
  [{ text: 'JavaScript' }]
];

for (const input of testCases) {
  const output = filter(input);
  console.log('Input:', input.map(t => t.text));
  console.log('Output:', output.map(t => t.text));
  console.log('---');
}
```
