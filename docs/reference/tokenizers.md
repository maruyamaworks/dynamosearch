# Tokenizers

Tokenizers split text into individual tokens for indexing and searching.

## Base Tokenizer

```typescript
import Tokenizer from 'dynamosearch/tokenizers/Tokenizer.js';
```

### Abstract Methods

```typescript
abstract class Tokenizer {
  static async getInstance(): Promise<Tokenizer>;
  abstract tokenize(str: string): { text: string }[];
}
```

## StandardTokenizer

Word-based tokenization using `Intl.Segmenter` API.

```typescript
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer.js';
```

### Usage

```typescript
const tokenizer = await StandardTokenizer.getInstance();
const tokens = tokenizer.tokenize('Hello, World! How are you?');
// [
//   { text: 'Hello' },
//   { text: 'World' },
//   { text: 'How' },
//   { text: 'are' },
//   { text: 'you' }
// ]
```

### Behavior

- Uses word boundaries from `Intl.Segmenter`
- Removes punctuation
- Preserves case (use `LowerCaseFilter` to normalize)
- Works with multiple languages

### Best For

- English and Western languages
- General text tokenization
- Word-based search

## IntlSegmenterTokenizer

Similar to StandardTokenizer with explicit locale support.

```typescript
import IntlSegmenterTokenizer from 'dynamosearch/tokenizers/IntlSegmenterTokenizer.js';
```

### getInstance()

```typescript
static async getInstance(options?: { locale?: string }): Promise<IntlSegmenterTokenizer>
```

**Parameters:**
- **locale** (`string`, optional) - BCP 47 language tag (default: `'en'`)

### Usage

```typescript
// English
const enTokenizer = await IntlSegmenterTokenizer.getInstance({ locale: 'en' });

// Japanese
const jaTokenizer = await IntlSegmenterTokenizer.getInstance({ locale: 'ja' });

// French
const frTokenizer = await IntlSegmenterTokenizer.getInstance({ locale: 'fr' });
```

## KeywordTokenizer

Returns the entire input as a single token.

```typescript
import KeywordTokenizer from 'dynamosearch/tokenizers/KeywordTokenizer.js';
```

### Usage

```typescript
const tokenizer = await KeywordTokenizer.getInstance();
const tokens = tokenizer.tokenize('product-abc-123-xyz');
// [{ text: 'product-abc-123-xyz' }]
```

### Best For

- Exact string matching
- IDs and identifiers
- Categories and tags
- Status codes
- Structured identifiers

## NGramTokenizer

Generates n-grams for partial matching.

```typescript
import NGramTokenizer from 'dynamosearch/tokenizers/NGramTokenizer.js';
```

### getInstance()

```typescript
static async getInstance(options?: { min?: number; max?: number }): Promise<NGramTokenizer>
```

**Parameters:**
- **min** (`number`, optional) - Minimum n-gram size (default: `2`)
- **max** (`number`, optional) - Maximum n-gram size (default: `3`)

### Usage

```typescript
const tokenizer = await NGramTokenizer.getInstance({ min: 2, max: 3 });
const tokens = tokenizer.tokenize('hello');
// [
//   { text: 'he' }, { text: 'el' }, { text: 'll' }, { text: 'lo' },  // 2-grams
//   { text: 'hel' }, { text: 'ell' }, { text: 'llo' }                // 3-grams
// ]
```

### Best For

- Partial/substring matching
- Autocomplete suggestions
- Fuzzy matching
- Short text fields
- Search-as-you-type

### Performance Notes

- Generates many tokens (impacts storage and search cost)
- Use with short text fields only
- Consider using with `min >= 2` to reduce token count

## PathHierarchyTokenizer

Splits paths into hierarchical components.

```typescript
import PathHierarchyTokenizer from 'dynamosearch/tokenizers/PathHierarchyTokenizer.js';
```

### getInstance()

```typescript
static async getInstance(options?: { delimiter?: string }): Promise<PathHierarchyTokenizer>
```

**Parameters:**
- **delimiter** (`string`, optional) - Path delimiter (default: `'/'`)

### Usage

```typescript
const tokenizer = await PathHierarchyTokenizer.getInstance({ delimiter: '/' });
const tokens = tokenizer.tokenize('/usr/local/bin/node');
// [
//   { text: '/usr' },
//   { text: '/usr/local' },
//   { text: '/usr/local/bin' },
//   { text: '/usr/local/bin/node' }
// ]
```

### Custom Delimiter

```typescript
const tokenizer = await PathHierarchyTokenizer.getInstance({ delimiter: '.' });
const tokens = tokenizer.tokenize('com.example.app.MainActivity');
// [
//   { text: 'com' },
//   { text: 'com.example' },
//   { text: 'com.example.app' },
//   { text: 'com.example.app.MainActivity' }
// ]
```

### Best For

- File system paths
- URL paths
- Package names
- Hierarchical identifiers
- Category hierarchies

## Creating Custom Tokenizers

### Basic Custom Tokenizer

```typescript
import Tokenizer from 'dynamosearch/tokenizers/Tokenizer.js';

class EmailTokenizer extends Tokenizer {
  static async getInstance() {
    return new EmailTokenizer();
  }

  tokenize(str: string) {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = str.match(regex) || [];
    return emails.map(text => ({ text }));
  }
}
```

### URL Tokenizer

```typescript
class UrlTokenizer extends Tokenizer {
  static async getInstance() {
    return new UrlTokenizer();
  }

  tokenize(str: string) {
    const regex = /https?:\/\/[^\s]+/g;
    const urls = str.match(regex) || [];
    return urls.map(text => ({ text }));
  }
}
```

### Whitespace Tokenizer

```typescript
class WhitespaceTokenizer extends Tokenizer {
  static async getInstance() {
    return new WhitespaceTokenizer();
  }

  tokenize(str: string) {
    return str.split(/\s+/)
      .filter(text => text.length > 0)
      .map(text => ({ text }));
  }
}
```

### CamelCase Tokenizer

```typescript
class CamelCaseTokenizer extends Tokenizer {
  static async getInstance() {
    return new CamelCaseTokenizer();
  }

  tokenize(str: string) {
    // Split on capital letters
    const words = str.replace(/([A-Z])/g, ' $1').trim().split(/\s+/);
    return words.map(text => ({ text }));
  }
}

const tokenizer = await CamelCaseTokenizer.getInstance();
tokenizer.tokenize('getUserByIdAndEmail');
// [
//   { text: 'get' },
//   { text: 'User' },
//   { text: 'By' },
//   { text: 'Id' },
//   { text: 'And' },
//   { text: 'Email' }
// ]
```