# Tokenizers

Tokenizers split text into individual tokens for indexing and searching.

## Base Tokenizer

```typescript
import Tokenizer from 'dynamosearch/tokenizers/Tokenizer';
```

### Abstract Methods

```typescript
abstract class Tokenizer {
  abstract tokenize(str: string): Promise<{ text: string }[]>;
}
```

## StandardTokenizer

Word-based tokenization that splits on hyphens, spaces, commas, and periods.

```typescript
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer';
```

### Constructor

```typescript
new StandardTokenizer(options?: { maxTokenLength?: number })
```

**Parameters:**
- **maxTokenLength** (`number`, optional) - Maximum token length (default: `255`)

### Usage

```typescript
const tokenizer = new StandardTokenizer();
const tokens = await tokenizer.tokenize('Hello, World! How are you?');
// [
//   { text: 'Hello' },
//   { text: 'World' },
//   { text: 'How' },
//   { text: 'are' },
//   { text: 'you' }
// ]
```

### Behavior

- Splits on pattern: `/[-\s,.]+/`
- Long tokens exceeding `maxTokenLength` are split at intervals
- Preserves case (use `LowerCaseFilter` to normalize)

### Best For

- English and Western languages
- General text tokenization
- Word-based search

## IntlSegmenterTokenizer

Locale-aware word segmentation using JavaScript `Intl.Segmenter` API.

```typescript
import IntlSegmenterTokenizer from 'dynamosearch/tokenizers/IntlSegmenterTokenizer';
```

### Constructor

```typescript
new IntlSegmenterTokenizer(options?: { locales?: Intl.LocalesArgument })
```

**Parameters:**
- **locales** (`Intl.LocalesArgument`, optional) - BCP 47 language tag(s) or Intl.Locale instance

### Usage

```typescript
// English
const enTokenizer = new IntlSegmenterTokenizer({ locales: 'en' });

// Japanese
const jaTokenizer = new IntlSegmenterTokenizer({ locales: 'ja' });

// French
const frTokenizer = new IntlSegmenterTokenizer({ locales: 'fr' });

const tokens = await jaTokenizer.tokenize('今日は良い天気です');
// [{ text: '今日' }, { text: 'は' }, { text: '良い' }, { text: '天気' }, { text: 'です' }]
```

### Best For

- Multilingual text
- Languages without spaces (Chinese, Japanese, Thai)
- Locale-specific word boundaries

## KeywordTokenizer

Returns the entire input as a single token.

```typescript
import KeywordTokenizer from 'dynamosearch/tokenizers/KeywordTokenizer';
```

### Constructor

```typescript
new KeywordTokenizer()
```

**Parameters:** None

### Usage

```typescript
const tokenizer = new KeywordTokenizer();
const tokens = await tokenizer.tokenize('product-abc-123-xyz');
// [{ text: 'product-abc-123-xyz' }]
```

### Best For

- Exact string matching
- IDs and identifiers
- Categories and tags
- Status codes
- Structured identifiers

## LetterTokenizer

Splits on non-letter characters using Unicode letter property.

```typescript
import LetterTokenizer from 'dynamosearch/tokenizers/LetterTokenizer';
```

### Constructor

```typescript
new LetterTokenizer()
```

**Parameters:** None

### Usage

```typescript
const tokenizer = new LetterTokenizer();
const tokens = await tokenizer.tokenize('Hello123World456');
// [{ text: 'Hello' }, { text: 'World' }]
```

### Behavior

- Uses pattern: `/\p{L}+/gu`
- Preserves case
- Works with Unicode letters

### Best For

- Extracting letter sequences
- International text
- When numbers/punctuation should be removed

## LowerCaseTokenizer

Splits on non-letter characters and lowercases each token.

```typescript
import LowerCaseTokenizer from 'dynamosearch/tokenizers/LowerCaseTokenizer';
```

### Constructor

```typescript
new LowerCaseTokenizer()
```

**Parameters:** None

### Usage

```typescript
const tokenizer = new LowerCaseTokenizer();
const tokens = await tokenizer.tokenize('Hello123WORLD456');
// [{ text: 'hello' }, { text: 'world' }]
```

### Behavior

- Uses pattern: `/\p{L}+/gu`
- Automatically lowercases
- Works with Unicode letters

### Best For

- Case-insensitive search
- Letter-only tokenization
- Simple text analysis

## WhitespaceTokenizer

Splits text on whitespace characters.

```typescript
import WhitespaceTokenizer from 'dynamosearch/tokenizers/WhitespaceTokenizer';
```

### Constructor

```typescript
new WhitespaceTokenizer(options?: { maxTokenLength?: number })
```

**Parameters:**
- **maxTokenLength** (`number`, optional) - Maximum token length (default: `255`)

### Usage

```typescript
const tokenizer = new WhitespaceTokenizer();
const tokens = await tokenizer.tokenize('hello-world foo_bar');
// [{ text: 'hello-world' }, { text: 'foo_bar' }]
```

### Behavior

- Splits on pattern: `/\s+/`
- Preserves punctuation and special characters
- Long tokens are split at `maxTokenLength`

### Best For

- Preserving punctuation
- Pre-tokenized input
- Space-delimited data

## NGramTokenizer

Generates character n-grams for partial matching.

```typescript
import NGramTokenizer from 'dynamosearch/tokenizers/NGramTokenizer';
```

### Constructor

```typescript
new NGramTokenizer(options?: { minGram?: number; maxGram?: number })
```

**Parameters:**
- **minGram** (`number`, optional) - Minimum n-gram size (default: `1`)
- **maxGram** (`number`, optional) - Maximum n-gram size (default: `2`)

### Usage

```typescript
const tokenizer = new NGramTokenizer({ minGram: 2, maxGram: 3 });
const tokens = await tokenizer.tokenize('hello');
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
- Consider using `minGram >= 2` to reduce token count

## PathHierarchyTokenizer

Splits paths into hierarchical components.

```typescript
import PathHierarchyTokenizer from 'dynamosearch/tokenizers/PathHierarchyTokenizer';
```

### Constructor

```typescript
new PathHierarchyTokenizer(options?: { delimiter?: string })
```

**Parameters:**
- **delimiter** (`string`, optional) - Path delimiter (default: `'/'`)

### Usage

```typescript
const tokenizer = new PathHierarchyTokenizer({ delimiter: '/' });
const tokens = await tokenizer.tokenize('/usr/local/bin/node');
// [
//   { text: '/usr' },
//   { text: '/usr/local' },
//   { text: '/usr/local/bin' },
//   { text: '/usr/local/bin/node' }
// ]
```

### Custom Delimiter

```typescript
const tokenizer = new PathHierarchyTokenizer({ delimiter: '.' });
const tokens = await tokenizer.tokenize('com.example.app.MainActivity');
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

## PatternTokenizer

Flexible regex-based tokenization with split or capture modes.

```typescript
import PatternTokenizer from 'dynamosearch/tokenizers/PatternTokenizer';
```

### Constructor

```typescript
new PatternTokenizer(options?: { pattern?: RegExp; group?: number })
```

**Parameters:**
- **pattern** (`RegExp`, optional) - Regular expression pattern (default: `/\W+/`)
- **group** (`number`, optional) - Capture group to extract (default: `-1`)
  - `-1` = split mode (split on pattern matches)
  - `>= 0` = capture mode (extract matching groups)

### Usage

```typescript
// Split mode (default)
const splitter = new PatternTokenizer({ pattern: /\W+/ });
const tokens1 = await splitter.tokenize('hello-world_foo');
// [{ text: 'hello' }, { text: 'world' }, { text: 'foo' }]

// Capture mode
const capturer = new PatternTokenizer({
  pattern: /\d+/g,
  group: 0,
});
const tokens2 = await capturer.tokenize('abc123def456');
// [{ text: '123' }, { text: '456' }]
```

### Best For

- Custom tokenization patterns
- Complex text parsing
- Domain-specific formats

## SimplePatternTokenizer

Captures text matching a pattern as tokens.

```typescript
import SimplePatternTokenizer from 'dynamosearch/tokenizers/SimplePatternTokenizer';
```

### Constructor

```typescript
new SimplePatternTokenizer(options?: { pattern?: RegExp })
```

**Parameters:**
- **pattern** (`RegExp`, optional) - Pattern to capture (default: `/^$/`)

### Usage

```typescript
const tokenizer = new SimplePatternTokenizer({ pattern: /\d+/g });
const tokens = await tokenizer.tokenize('Order 123 and 456');
// [{ text: '123' }, { text: '456' }]
```

### Best For

- Extracting specific patterns
- Number extraction
- Simple pattern matching

## SimplePatternSplitTokenizer

Splits input at pattern matches.

```typescript
import SimplePatternSplitTokenizer from 'dynamosearch/tokenizers/SimplePatternSplitTokenizer';
```

### Constructor

```typescript
new SimplePatternSplitTokenizer(options?: { pattern?: RegExp })
```

**Parameters:**
- **pattern** (`RegExp`, optional) - Pattern to split on (default: `/^$/`)

### Usage

```typescript
const tokenizer = new SimplePatternSplitTokenizer({ pattern: /[,;]+/ });
const tokens = await tokenizer.tokenize('apple,banana;cherry');
// [{ text: 'apple' }, { text: 'banana' }, { text: 'cherry' }]
```

### Best For

- Custom delimiters
- CSV-like data
- Simple splitting logic

## URLEmailTokenizer

Preserves URLs and email addresses as complete tokens.

```typescript
import URLEmailTokenizer from 'dynamosearch/tokenizers/URLEmailTokenizer';
```

### Constructor

```typescript
new URLEmailTokenizer(options?: { maxTokenLength?: number })
```

**Parameters:**
- **maxTokenLength** (`number`, optional) - Maximum token length (default: `255`)

### Usage

```typescript
const tokenizer = new URLEmailTokenizer();
const tokens = await tokenizer.tokenize('Visit https://example.com or email admin@example.com');
// [
//   { text: 'Visit' },
//   { text: 'https://example.com' },
//   { text: 'or' },
//   { text: 'email' },
//   { text: 'admin@example.com' }
// ]
```

### Behavior

- Preserves complete URLs (http/https)
- Preserves complete email addresses
- Tokenizes remaining text like StandardTokenizer

### Best For

- Content with URLs
- Email address extraction
- Web content indexing

## Creating Custom Tokenizers

### Basic Custom Tokenizer

```typescript
import Tokenizer from 'dynamosearch/tokenizers/Tokenizer';

class EmailTokenizer extends Tokenizer {
  async tokenize(str: string) {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = str.match(regex) || [];
    return emails.map((text) => ({ text }));
  }
}
```

### URL Tokenizer

```typescript
class UrlTokenizer extends Tokenizer {
  async tokenize(str: string) {
    const regex = /https?:\/\/[^\s]+/g;
    const urls = str.match(regex) || [];
    return urls.map((text) => ({ text }));
  }
}
```

### CamelCase Tokenizer

```typescript
class CamelCaseTokenizer extends Tokenizer {
  async tokenize(str: string) {
    // Split on capital letters
    const words = str.replace(/([A-Z])/g, ' $1').trim().split(/\s+/);
    return words.map((text) => ({ text }));
  }
}

const tokenizer = new CamelCaseTokenizer();
await tokenizer.tokenize('getUserByIdAndEmail');
// [
//   { text: 'get' },
//   { text: 'User' },
//   { text: 'By' },
//   { text: 'Id' },
//   { text: 'And' },
//   { text: 'Email' }
// ]
```

### Phone Number Tokenizer

```typescript
class PhoneTokenizer extends Tokenizer {
  async tokenize(str: string) {
    const regex = /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
    const phones = str.match(regex) || [];
    return phones.map((text) => ({ text }));
  }
}
```
