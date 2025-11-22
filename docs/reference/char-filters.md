# Character Filters

Character filters preprocess raw text before tokenization.

## Type Definition

```typescript
type CharacterFilter = (str: string) => string;
```

Character filters are simple functions that transform strings.

## ICUNormalizer

Unicode text normalization using ICU normalization forms.

```typescript
import ICUNormalizer from 'dynamosearch/char_filters/ICUNormalizer';
```

### Constructor

```typescript
ICUNormalizer(options?: { name?: 'nfc' | 'nfkc'; mode?: 'compose' | 'decompose' })
```

**Parameters:**
- **name** (`'nfc' | 'nfkc'`, optional) - Normalization form (default: `'nfkc'`)
- **mode** (`'compose' | 'decompose'`, optional) - Composition mode (default: `'compose'`)

### Normalization Forms

The filter supports four Unicode normalization forms:

| name     | mode         | Result | Description                      |
| -------- | ------------ | ------ | -------------------------------- |
| `'nfc'`  | `'compose'`  | NFC    | Canonical Composition            |
| `'nfc'`  | `'decompose'`| NFD    | Canonical Decomposition          |
| `'nfkc'` | `'compose'`  | NFKC   | Compatibility Composition        |
| `'nfkc'` | `'decompose'`| NFKD   | Compatibility Decomposition      |

### Usage

```typescript
// NFKC (default) - Compatibility Composition
const nfkc = ICUNormalizer();
const text1 = nfkc('ﬁ'); // 'fi' (ligature normalized)

// NFC - Canonical Composition
const nfc = ICUNormalizer({ name: 'nfc', mode: 'compose' });
const text2 = nfc('café'); // 'café' (precomposed)

// NFD - Canonical Decomposition
const nfd = ICUNormalizer({ name: 'nfc', mode: 'decompose' });
const text3 = nfd('café'); // 'café' (decomposed: c + a + f + e + ́)

// NFKD - Compatibility Decomposition
const nfkd = ICUNormalizer({ name: 'nfkc', mode: 'decompose' });
const text4 = nfkd('²'); // '2' (superscript normalized)
```

### Examples

#### NFKC (Recommended for Search)

```typescript
const filter = ICUNormalizer({ name: 'nfkc', mode: 'compose' });

// Normalizes various Unicode representations to standard forms
filter('ﬁle'); // 'file' (ligature)
filter('½'); // '1⁄2' (fraction)
filter('²'); // '2' (superscript)
filter('ＡＢＣ'); // 'ABC' (full-width)
```

#### NFC (Canonical Composition)

```typescript
const filter = ICUNormalizer({ name: 'nfc', mode: 'compose' });

// Combines decomposed characters
filter('café'); // 'café' (é as single character)
filter('naïve'); // 'naïve' (ï as single character)
```

#### NFD (Canonical Decomposition)

```typescript
const filter = ICUNormalizer({ name: 'nfc', mode: 'decompose' });

// Decomposes combined characters
filter('café'); // 'café' (é as e + combining acute)
filter('naïve'); // 'naïve' (ï as i + combining diaeresis)
```

### Best For

- **NFKC**: General search applications (normalizes ligatures, superscripts, full-width chars)
- **NFC**: Text storage and display (canonical representation)
- **NFD**: Accent-insensitive search (combine with accent stripping)
- **NFKD**: Maximum normalization (compatibility + decomposition)

### Use with Analyzers

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer';
import ICUNormalizer from 'dynamosearch/char_filters/ICUNormalizer';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';

class NormalizedAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [ICUNormalizer()],
      tokenizer: new StandardTokenizer(),
      filters: [LowerCaseFilter()],
    });
  }
}
```

## Custom Character Filters

### HTML Strip Filter

Remove HTML tags:

```typescript
const htmlStripFilter: CharacterFilter = (str) => {
  return str.replace(/<[^>]*>/g, '');
};

// Usage
htmlStripFilter('<p>Hello <b>World</b></p>');
// 'Hello World'
```

### Pattern Replace Filter

Replace patterns in text:

```typescript
const patternReplaceFilter = (
  pattern: RegExp,
  replacement: string,
): CharacterFilter => {
  return (str) => str.replace(pattern, replacement);
};

// Usage: Normalize phone numbers
const phoneNormalizer = patternReplaceFilter(/[()-\s]/g, '');
phoneNormalizer('(555) 123-4567'); // '5551234567'
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
  '&': 'and',
});

specialCharMapper('Apple® & Microsoft™');
// 'Apple(r) and Microsoft(tm)'
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

### Zero-Width Character Remover

Remove invisible characters:

```typescript
const zeroWidthRemover: CharacterFilter = (str) => {
  return str.replace(/[\u200B-\u200D\uFEFF]/g, '');
};

// Removes zero-width space, zero-width non-joiner, zero-width joiner, BOM
```

### Emoji Remover

Remove emoji characters:

```typescript
const emojiRemover: CharacterFilter = (str) => {
  return str.replace(/[\p{Emoji}]/gu, '');
};

emojiRemover('Hello 👋 World 🌍');
// 'Hello  World '
```

### URL Normalizer

Normalize URLs:

```typescript
const urlNormalizer: CharacterFilter = (str) => {
  return str
    .replace(/https?:\/\//g, '') // Remove protocol
    .replace(/www\./g, '') // Remove www
    .replace(/\/$/g, ''); // Remove trailing slash
};

urlNormalizer('https://www.example.com/');
// 'example.com'
```

### Case Folder

Advanced case folding:

```typescript
const caseFoldFilter: CharacterFilter = (str) => {
  return str.toLocaleLowerCase();
};

caseFoldFilter('ΣΕΛΛΑΣ'); // Greek uppercase
// 'σελλας' (lowercase)
```

## Filter Chains

Combine multiple character filters:

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer';
import ICUNormalizer from 'dynamosearch/char_filters/ICUNormalizer';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';

const htmlStripFilter = (str: string) => str.replace(/<[^>]*>/g, '');
const whitespaceNormalizer = (str: string) => str.replace(/\s+/g, ' ').trim();

class HtmlAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [
        ICUNormalizer({ name: 'nfkc' }),
        htmlStripFilter,
        whitespaceNormalizer,
      ],
      tokenizer: new StandardTokenizer(),
      filters: [LowerCaseFilter()],
    });
  }
}

// Example usage
const analyzer = new HtmlAnalyzer();
await analyzer.analyze('<p>Hello   <b>World</b></p>');
// [{ text: 'hello' }, { text: 'world' }]
```

## Best Practices

1. **Apply normalization first**: ICUNormalizer should typically be the first filter
2. **Remove markup early**: Strip HTML/XML before tokenization
3. **Normalize whitespace**: Clean up extra spaces after removing markup
4. **Keep it simple**: Only use character filters when necessary
5. **Order matters**: Apply filters in logical sequence (normalize → clean → prepare)

## Performance Considerations

- Character filters run on the entire input string before tokenization
- Keep filters efficient, especially for large documents
- Minimize regex complexity in pattern-based filters
- Consider caching results for frequently processed text
