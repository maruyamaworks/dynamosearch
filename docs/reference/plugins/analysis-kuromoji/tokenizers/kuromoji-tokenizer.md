# KuromojiTokenizer

Japanese morphological analyzer using Kuromoji.

## Import

```typescript
import KuromojiTokenizer from '@dynamosearch/plugin-analysis-kuromoji/tokenizers/KuromojiTokenizer';
```

## Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

## Constructor

```typescript
new KuromojiTokenizer()
```

No parameters required.

## Example

```typescript
const tokenizer = new KuromojiTokenizer();
const tokens = await tokenizer.tokenize('すもももももももものうち');
// [
//   { token: 'すもも', startOffset: 0, endOffset: 3, position: 0 },
//   { token: 'も', startOffset: 3, endOffset: 4, position: 1 },
//   { token: 'もも', startOffset: 4, endOffset: 6, position: 2 },
//   { token: 'も', startOffset: 6, endOffset: 7, position: 3 },
//   { token: 'もも', startOffset: 7, endOffset: 9, position: 4 },
//   { token: 'の', startOffset: 9, endOffset: 10, position: 5 },
//   { token: 'うち', startOffset: 10, endOffset: 12, position: 6 }
// ]
```

## How It Works

Uses the Kuromoji Japanese morphological analyzer to segment Japanese text into words based on:
- Dictionary-based word recognition
- Part-of-speech analysis
- Proper handling of Japanese grammar

## Token Metadata

Each token includes metadata from morphological analysis:

```typescript
interface IpadicFeatures {
  word_id: number;
  word_type: string;
  word_position: number;
  surface_form: string;
  pos: string;           // Part of speech (品詞)
  pos_detail_1: string;  // POS detail 1
  pos_detail_2: string;  // POS detail 2
  pos_detail_3: string;  // POS detail 3
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;    // Dictionary form
  reading: string;       // Reading (kana)
  pronunciation: string; // Pronunciation
}
```

## Best For

- Japanese text
- Proper word segmentation for Japanese
- Japanese search applications

## See Also

- [KuromojiAnalyzer](../analyzers/kuromoji-analyzer.md)
- [KuromojiBaseFormFilter](../filters/kuromoji-base-form-filter.md)
- [IntlSegmenterTokenizer](/reference/tokenizers/intl-segmenter-tokenizer.md) - For simpler Japanese tokenization
