# Character Filters

Character filters preprocess raw text before tokenization.

## Type Definition

```typescript
abstract class CharacterFilter {
  abstract apply(str: string): string;
}
```

Character filters are simple functions that transform strings.

## ICUNormalizer

Unicode text normalization using ICU normalization forms.

```typescript
import ICUNormalizer from 'dynamosearch/char_filters/ICUNormalizer';
```

### Constructor

```typescript
new ICUNormalizer(options?: { name?: 'nfc' | 'nfkc'; mode?: 'compose' | 'decompose' })
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
const nfkc = new ICUNormalizer();
const text1 = nfkc.apply('ﬁ'); // 'fi' (ligature normalized)

// NFC - Canonical Composition
const nfc = new ICUNormalizer({ name: 'nfc', mode: 'compose' });
const text2 = nfc.apply('café'); // 'café' (precomposed)

// NFD - Canonical Decomposition
const nfd = new ICUNormalizer({ name: 'nfc', mode: 'decompose' });
const text3 = nfd.apply('café'); // 'café' (decomposed: c + a + f + e + ́)

// NFKD - Compatibility Decomposition
const nfkd = new ICUNormalizer({ name: 'nfkc', mode: 'decompose' });
const text4 = nfkd.apply('²'); // '2' (superscript normalized)
```

### Examples

#### NFKC (Recommended for Search)

```typescript
const filter = new ICUNormalizer({ name: 'nfkc', mode: 'compose' });

// Normalizes various Unicode representations to standard forms
filter.apply('ﬁle'); // 'file' (ligature)
filter.apply('½'); // '1⁄2' (fraction)
filter.apply('²'); // '2' (superscript)
filter.apply('ＡＢＣ'); // 'ABC' (full-width)
```

#### NFC (Canonical Composition)

```typescript
const filter = new ICUNormalizer({ name: 'nfc', mode: 'compose' });

// Combines decomposed characters
filter.apply('café'); // 'café' (é as single character)
filter.apply('naïve'); // 'naïve' (ï as single character)
```

#### NFD (Canonical Decomposition)

```typescript
const filter = new ICUNormalizer({ name: 'nfc', mode: 'decompose' });

// Decomposes combined characters
filter.apply('café'); // 'café' (é as e + combining acute)
filter.apply('naïve'); // 'naïve' (ï as i + combining diaeresis)
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
      charFilters: [new ICUNormalizer()],
      tokenizer: new StandardTokenizer(),
      filters: [new LowerCaseFilter()],
    });
  }
}
```
