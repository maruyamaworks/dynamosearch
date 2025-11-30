# ICUNormalizer

Unicode text normalization using ICU normalization forms.

## Import

```typescript
import ICUNormalizer from 'dynamosearch/char_filters/ICUNormalizer';
```

## Constructor

```typescript
new ICUNormalizer(options?: { name?: 'nfc' | 'nfkc'; mode?: 'compose' | 'decompose' })
```

### Parameters

- **name** (`'nfc' | 'nfkc'`, optional) - Normalization form (default: `'nfkc'`)
- **mode** (`'compose' | 'decompose'`, optional) - Composition mode (default: `'compose'`)

## Normalization Forms

The filter supports four Unicode normalization forms:

| name     | mode         | Result | Description                      |
| -------- | ------------ | ------ | -------------------------------- |
| `'nfc'`  | `'compose'`  | NFC    | Canonical Composition            |
| `'nfc'`  | `'decompose'`| NFD    | Canonical Decomposition          |
| `'nfkc'` | `'compose'`  | NFKC   | Compatibility Composition        |
| `'nfkc'` | `'decompose'`| NFKD   | Compatibility Decomposition      |

## Examples

### NFKC (Default - Recommended for Search)

```typescript
const filter = new ICUNormalizer();
// or
const filter = new ICUNormalizer({ name: 'nfkc', mode: 'compose' });

// Normalizes various Unicode representations to standard forms
filter.apply('ﬁle'); // 'file' (ligature normalized)
filter.apply('½'); // '1⁄2' (fraction)
filter.apply('²'); // '2' (superscript)
filter.apply('ＡＢＣ'); // 'ABC' (full-width to half-width)
```

### NFC (Canonical Composition)

```typescript
const filter = new ICUNormalizer({ name: 'nfc', mode: 'compose' });

// Combines decomposed characters
filter.apply('café'); // 'café' (é as single character)
filter.apply('naïve'); // 'naïve' (ï as single character)
```

### NFD (Canonical Decomposition)

```typescript
const filter = new ICUNormalizer({ name: 'nfc', mode: 'decompose' });

// Decomposes combined characters
filter.apply('café'); // 'café' (é as e + combining acute)
filter.apply('naïve'); // 'naïve' (ï as i + combining diaeresis)
```

### NFKD (Compatibility Decomposition)

```typescript
const filter = new ICUNormalizer({ name: 'nfkc', mode: 'decompose' });

filter.apply('²'); // '2' (superscript normalized)
filter.apply('ﬁ'); // 'fi' (ligature decomposed)
```

## Best For

- **NFKC**: General search applications (normalizes ligatures, superscripts, full-width chars)
- **NFC**: Text storage and display (canonical representation)
- **NFD**: Accent-insensitive search (combine with accent stripping)
- **NFKD**: Maximum normalization (compatibility + decomposition)

## Use with Analyzers

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

const analyzer = new NormalizedAnalyzer();
const tokens = await analyzer.analyze('ﬁle café');
// Normalizes Unicode before tokenization
```

## See Also

- [ASCIIFoldingFilter](/reference/filters/ascii-folding-filter.md) - For converting accents to ASCII
- [Analyzer](/reference/analyzers/analyzer.md) - For using in analysis pipelines
