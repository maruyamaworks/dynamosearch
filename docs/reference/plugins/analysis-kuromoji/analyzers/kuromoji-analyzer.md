# KuromojiAnalyzer

Japanese text analyzer using Kuromoji morphological analysis.

## Import

```typescript
import KuromojiAnalyzer from '@dynamosearch/plugin-analysis-kuromoji/analyzers/KuromojiAnalyzer';
```

## Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

## Constructor

```typescript
new KuromojiAnalyzer()
```

No parameters required.

## Pipeline

- **Tokenizer**: `KuromojiTokenizer`
- **Filters**: `LowerCaseFilter`, `CJKWidthFilter`

## Example

```typescript
const analyzer = new KuromojiAnalyzer();
const tokens = await analyzer.analyze('東京タワーに行きました');
// [
//   { token: '東京', startOffset: 0, endOffset: 2, position: 0 },
//   { token: 'タワー', startOffset: 2, endOffset: 5, position: 1 },
//   { token: 'に', startOffset: 5, endOffset: 6, position: 2 },
//   { token: '行き', startOffset: 6, endOffset: 8, position: 3 },
//   { token: 'まし', startOffset: 8, endOffset: 10, position: 4 },
//   { token: 'た', startOffset: 10, endOffset: 11, position: 5 }
// ]
```

## How It Works

1. **KuromojiTokenizer**: Performs Japanese morphological analysis to segment text into words
2. **LowerCaseFilter**: Converts alphabetic characters to lowercase
3. **CJKWidthFilter**: Normalizes full-width/half-width characters

## Best For

- Japanese text
- Mixed Japanese/English content
- Japanese search applications

## See Also

- [KuromojiTokenizer](../tokenizers/kuromoji-tokenizer.md)
- [KuromojiBaseFormFilter](../filters/kuromoji-base-form-filter.md)
- [KuromojiPartOfSpeechStopFilter](../filters/kuromoji-part-of-speech-stop-filter.md)
