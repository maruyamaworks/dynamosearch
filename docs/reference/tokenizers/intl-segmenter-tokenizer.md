# IntlSegmenterTokenizer

Locale-aware word segmentation using JavaScript `Intl.Segmenter` API.

## Import

```typescript
import IntlSegmenterTokenizer from 'dynamosearch/tokenizers/IntlSegmenterTokenizer';
```

## Constructor

```typescript
new IntlSegmenterTokenizer(options?: { locales?: Intl.LocalesArgument })
```

### Parameters

- **locales** (`Intl.LocalesArgument`, optional) - BCP 47 language tag(s) or Intl.Locale instance

## Examples

### English

```typescript
const tokenizer = new IntlSegmenterTokenizer({ locales: 'en' });
const tokens = await tokenizer.tokenize('Hello world');
```

### Japanese

```typescript
const tokenizer = new IntlSegmenterTokenizer({ locales: 'ja' });
const tokens = await tokenizer.tokenize('今日は良い天気です');
// [
//   { token: '今日', startOffset: 0, endOffset: 2, position: 0 },
//   { token: 'は', startOffset: 2, endOffset: 3, position: 1 },
//   { token: '良い', startOffset: 3, endOffset: 5, position: 2 },
//   { token: '天気', startOffset: 5, endOffset: 7, position: 3 },
//   { token: 'です', startOffset: 7, endOffset: 9, position: 4 }
// ]
```

### French

```typescript
const tokenizer = new IntlSegmenterTokenizer({ locales: 'fr' });
const tokens = await tokenizer.tokenize('Bonjour le monde');
```

## Behavior

- Uses browser/Node.js built-in `Intl.Segmenter` API
- Respects locale-specific word boundaries
- Handles languages without spaces (CJK)
- No external dependencies required

## Best For

- Multilingual text
- Languages without spaces (Chinese, Japanese, Thai)
- Locale-specific word boundaries

## See Also

- [StandardTokenizer](./standard-tokenizer.md) - For English/Western languages
- [LetterTokenizer](./letter-tokenizer.md) - For simple letter-based tokenization
