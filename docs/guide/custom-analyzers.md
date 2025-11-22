# Custom Analyzers

Build custom analyzers to handle specific text analysis requirements for your application.

## Analyzer Basics

An analyzer consists of three components:

1. **Character Filters** (0 or more): Preprocess text
2. **Tokenizer** (exactly 1): Split text into tokens
3. **Token Filters** (0 or more): Transform tokens

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';

class MyAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [],
      tokenizer: new StandardTokenizer(),
      filters: [LowerCaseFilter()]
    });
  }
}
```

## Custom Character Filters

Character filters transform the raw text before tokenization.

### HTML Strip Filter

```typescript
const htmlStripFilter = (str: string): string => {
  return str.replace(/<[^>]*>/g, '');
};

// Usage
class HtmlAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [htmlStripFilter],
      tokenizer: new StandardTokenizer(),
      filters: [LowerCaseFilter()]
    });
  }
}

const analyzer = new HtmlAnalyzer();
analyzer.analyze('<p>Hello <strong>World</strong></p>');
// [{ text: 'hello' }, { text: 'world' }]
```

### Pattern Replace Filter

```typescript
const patternReplaceFilter = (pattern: RegExp, replacement: string) => {
  return (str: string): string => str.replace(pattern, replacement);
};

// Usage: Normalize phone numbers
const phoneFilter = patternReplaceFilter(/[()-\s]/g, '');

class PhoneAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [phoneFilter],
      tokenizer: new KeywordTokenizer(),
      filters: []
    });
  }
}

const analyzer = new PhoneAnalyzer();
analyzer.analyze('(555) 123-4567');
// [{ text: '5551234567' }]
```

### Mapping Filter

```typescript
const mappingFilter = (mappings: Record<string, string>) => {
  return (str: string): string => {
    let result = str;
    for (const [from, to] of Object.entries(mappings)) {
      result = result.replaceAll(from, to);
    }
    return result;
  };
};

// Usage: Normalize special characters
const specialCharFilter = mappingFilter({
  '©': '(c)',
  '®': '(r)',
  '™': '(tm)',
  '&': 'and'
});
```

## Custom Tokenizers

Tokenizers must implement the Tokenizer interface:

```typescript
abstract class Tokenizer {
  constructor(): Promise<Tokenizer> {
    throw new Error('Not implemented');
  }

  abstract tokenize(str: string): { text: string }[];
}
```

### Email Tokenizer

```typescript
import Tokenizer from 'dynamosearch/tokenizers/Tokenizer';

class EmailTokenizer extends Tokenizer {
  constructor() {
    super();
  }

  tokenize(str: string) {
    const emails = str.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    return emails.map(text => ({ text }));
  }
}

// Usage
const tokenizer = new EmailTokenizer();
tokenizer.tokenize('Contact us at support@example.com or sales@example.com');
// [{ text: 'support@example.com' }, { text: 'sales@example.com' }]
```

### Whitespace Tokenizer

```typescript
class WhitespaceTokenizer extends Tokenizer {
  constructor() {
    super();
  }

  tokenize(str: string) {
    return str.split(/\s+/)
      .filter(text => text.length > 0)
      .map(text => ({ text }));
  }
}

// Usage
const tokenizer = new WhitespaceTokenizer();
tokenizer.tokenize('hello   world\n\tfoo');
// [{ text: 'hello' }, { text: 'world' }, { text: 'foo' }]
```

### URL Tokenizer

```typescript
class UrlTokenizer extends Tokenizer {
  constructor() {
    super();
  }

  tokenize(str: string) {
    const urls = str.match(/https?:\/\/[^\s]+/g) || [];
    return urls.map(text => ({ text }));
  }
}
```

## Custom Token Filters

Token filters transform or remove tokens.

### Stop Words Filter

```typescript
import type { TokenFilter } from 'dynamosearch/analyzers/Analyzer';

const stopWordsFilter = (stopWords: string[]): TokenFilter => {
  const stopWordsSet = new Set(stopWords.map(w => w.toLowerCase()));
  return (tokens) => tokens.filter(token => !stopWordsSet.has(token.text.toLowerCase()));
};

// Usage: English stop words
const englishStopWords = [
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'is', 'was', 'are', 'were', 'be', 'been', 'being'
];

class EnglishAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [],
      tokenizer: new StandardTokenizer(),
      filters: [
        LowerCaseFilter(),
        stopWordsFilter(englishStopWords)
      ]
    });
  }
}

const analyzer = new EnglishAnalyzer();
analyzer.analyze('The quick brown fox');
// [{ text: 'quick' }, { text: 'brown' }, { text: 'fox' }]
```

### Length Filter

```typescript
const lengthFilter = (min: number, max?: number): TokenFilter => {
  return (tokens) => tokens.filter(token => {
    const len = token.text.length;
    return len >= min && (!max || len <= max);
  });
};

// Usage: Remove very short and very long tokens
class LengthAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [],
      tokenizer: new StandardTokenizer(),
      filters: [
        LowerCaseFilter(),
        lengthFilter(3, 20)  // Keep tokens between 3-20 chars
      ]
    });
  }
}
```

### Unique Filter

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

// Usage: Remove duplicate tokens
class UniqueAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [],
      tokenizer: new StandardTokenizer(),
      filters: [
        LowerCaseFilter(),
        uniqueFilter()
      ]
    });
  }
}

const analyzer = new UniqueAnalyzer();
analyzer.analyze('hello world hello');
// [{ text: 'hello' }, { text: 'world' }]
```

### Stemming Filter (Simple)

```typescript
const simpleStemFilter = (): TokenFilter => {
  const rules: [RegExp, string][] = [
    [/ies$/, 'y'],      // berries -> berry
    [/es$/, ''],        // boxes -> box
    [/s$/, ''],         // cats -> cat
    [/ing$/, ''],       // running -> runn
    [/ed$/, '']         // walked -> walk
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

### ASCII Folding Filter

```typescript
const asciiFoldingFilter = (): TokenFilter => {
  return (tokens) => tokens.map(token => ({
    text: token.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }));
};

// Usage: Convert accented characters to ASCII
const analyzer = new Analyzer({
  tokenizer: new StandardTokenizer(),
  filters: [asciiFoldingFilter(), LowerCaseFilter()]
});

analyzer.analyze('café résumé naïve');
// [{ text: 'cafe' }, { text: 'resume' }, { text: 'naive' }]
```

## Real-World Examples

### Code Search Analyzer

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';

const camelCaseSplitFilter = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
};

class CodeAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [camelCaseSplitFilter],
      tokenizer: new StandardTokenizer(),
      filters: [LowerCaseFilter()]
    });
  }
}

const analyzer = new CodeAnalyzer();
analyzer.analyze('getUserById calculateTotalPrice');
// [
//   { text: 'get' }, { text: 'user' }, { text: 'by' }, { text: 'id' },
//   { text: 'calculate' }, { text: 'total' }, { text: 'price' }
// ]
```

### Product Search Analyzer

```typescript
const synonymFilter = (synonyms: Record<string, string>): TokenFilter => {
  return (tokens) => tokens.map(token => ({
    text: synonyms[token.text.toLowerCase()] || token.text
  }));
};

class ProductAnalyzer extends Analyzer {
  constructor() {
    const productSynonyms = {
      'tv': 'television',
      'pc': 'computer',
      'laptop': 'computer',
      'phone': 'smartphone',
      'cellphone': 'smartphone'
    };

    super({
      charFilters: [],
      tokenizer: new StandardTokenizer(),
      filters: [
        LowerCaseFilter(),
        synonymFilter(productSynonyms)
      ]
    });
  }
}
```

### Address Analyzer

```typescript
const abbreviationFilter = mappingFilter({
  'Street': 'St',
  'Avenue': 'Ave',
  'Boulevard': 'Blvd',
  'Road': 'Rd',
  'Drive': 'Dr',
  'Apartment': 'Apt',
  'Suite': 'Ste'
});

class AddressAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [abbreviationFilter],
      tokenizer: new StandardTokenizer(),
      filters: [LowerCaseFilter()]
    });
  }
}
```

## Testing Your Analyzer

Always test your analyzer with sample data:

```typescript
const analyzer = new MyAnalyzer();

const testCases = [
  'Hello World!',
  'THE QUICK BROWN FOX',
  'user@example.com',
  '123-456-7890'
];

for (const input of testCases) {
  const tokens = analyzer.analyze(input);
  console.log(`Input: "${input}"`);
  console.log('Tokens:', tokens.map(t => t.text));
  console.log('---');
}
```

## Performance Considerations

### Avoid Expensive Operations

```typescript
// ❌ Slow: External API call
const badFilter = (str: string): string => {
  const response = await fetch(`https://api.example.com/normalize?text=${str}`);
  return response.text();
};

// ✅ Fast: Local processing
const goodFilter = (str: string): string => {
  return str.toLowerCase().trim();
};
```

### Cache Compiled Patterns

```typescript
// ❌ Slow: Recompile regex every time
const badFilter = (str: string): string => {
  return str.replace(new RegExp('pattern', 'g'), 'replacement');
};

// ✅ Fast: Compile once
const pattern = /pattern/g;
const goodFilter = (str: string): string => {
  return str.replace(pattern, 'replacement');
};
```
