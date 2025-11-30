# KuromojiBaseFormFilter

Converts tokens to their base (dictionary) form using morphological analysis.

## Import

```typescript
import KuromojiBaseFormFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiBaseFormFilter';
```

## Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

## Constructor

```typescript
new KuromojiBaseFormFilter()
```

No parameters required.

## Example

```typescript
const filter = new KuromojiBaseFormFilter();
const tokens = filter.apply([
  { token: '走った', metadata: { basic_form: '走る' } },
  { token: '食べる', metadata: { basic_form: '*' } },
  { token: '美しい', metadata: { basic_form: '美しい' } }
]);
// [
//   { token: '走る', metadata: { basic_form: '走る' } },    // Past tense → Base form
//   { token: '食べる', metadata: { basic_form: '*' } },     // No change (already base form)
//   { token: '美しい', metadata: { basic_form: '美しい' } }  // No change
// ]
```

## How It Works

- Uses the `basic_form` field from kuromoji metadata
- If `basic_form` is missing or `'*'`, keeps the original token
- Normalizes verb conjugations, adjective forms, and inflections

## Examples

| Original | Base Form | Description |
|----------|-----------|-------------|
| 走った | 走る | Past tense → dictionary form |
| 走ります | 走る | Polite form → dictionary form |
| 美しかった | 美しい | Past adjective → base form |
| 食べている | 食べる | Progressive → dictionary form |

## Best For

- Improving recall by matching different word forms
- Japanese verb and adjective normalization
- Search that should match regardless of conjugation

## See Also

- [KuromojiTokenizer](../tokenizers/kuromoji-tokenizer.md) - Provides morphological metadata
- [KuromojiPartOfSpeechStopFilter](./kuromoji-part-of-speech-stop-filter.md)
- [PorterStemFilter](/reference/filters/porter-stem-filter.md) - English equivalent
