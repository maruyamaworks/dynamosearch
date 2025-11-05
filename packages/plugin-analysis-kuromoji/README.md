# @dynamosearch/plugin-analysis-kuromoji

Japanese text analysis plugin for DynamoSearch using Kuromoji morphological analyzer.

## Installation

```bash
npm install dynamosearch @dynamosearch/plugin-analysis-kuromoji
```

## Usage

### Basic Setup

```typescript
import DynamoSearch from 'dynamosearch';
import KuromojiAnalyzer from '@dynamosearch/plugin-analysis-kuromoji/analyzers/KuromojiAnalyzer.js';

const analyzer = await KuromojiAnalyzer.getInstance();
const dynamosearch = new DynamoSearch({
  indexTableName: 'my-search-index',
  attributes: [
    { name: 'title', analyzer: analyzer },
    { name: 'body', analyzer: analyzer },
  ],
  keys: [
    { name: 'id', type: 'HASH' },
  ],
});

// Search in Japanese
const results = await dynamosearch.search('東京タワー', {
  attributes: ['title^2', 'body'],
});
```

## Components

### KuromojiAnalyzer

Pre-configured analyzer optimized for Japanese text search.

```typescript
import KuromojiAnalyzer from '@dynamosearch/plugin-analysis-kuromoji/analyzers/KuromojiAnalyzer.js';

const analyzer = await KuromojiAnalyzer.getInstance();
```

**Pipeline:**
1. **Character Filter:** `ICUNormalizer` - Unicode normalization
2. **Tokenizer:** `KuromojiTokenizer` - Japanese morphological analysis
3. **Token Filters:**
   - `KuromojiBaseFormFilter` - Converts to base form (e.g., "走った" → "走る")
   - `KuromojiPartOfSpeechStopFilter` - Removes common particles and auxiliary verbs
   - `CJKWidthFilter` - Normalizes full-width/half-width characters
   - `JapaneseStopFilter` - Removes Japanese stop words
   - `KuromojiKatakanaStemFilter` - Normalizes katakana prolonged sound marks
   - `LowerCaseFilter` - Converts to lowercase

### KuromojiTokenizer

Japanese morphological analyzer using the Kuromoji library with IPAdic dictionary.

```typescript
import KuromojiTokenizer from '@dynamosearch/plugin-analysis-kuromoji/tokenizers/KuromojiTokenizer.js';

const tokenizer = await KuromojiTokenizer.getInstance({
  discardPunctuation: true,  // default: true
  dicPath: 'path/to/dict',   // optional: custom dictionary path
});

const tokens = tokenizer.tokenize('東京タワーに行きました');
// [
//   { text: '東京', metadata: { basic_form: '東京', pos: '名詞', ... } },
//   { text: 'タワー', metadata: { basic_form: 'タワー', pos: '名詞', ... } },
//   { text: 'に', metadata: { basic_form: 'に', pos: '助詞', ... } },
//   { text: '行き', metadata: { basic_form: '行く', pos: '動詞', ... } },
//   { text: 'まし', metadata: { basic_form: 'ます', pos: '助動詞', ... } },
//   { text: 'た', metadata: { basic_form: 'た', pos: '助動詞', ... } },
// ]
```

**Options:**
- `discardPunctuation: boolean` - Remove punctuation tokens (default: `true`)
- `dicPath: string` - Path to Kuromoji dictionary (default: bundled IPAdic)

**Token Metadata:**

Each token includes Kuromoji's IPAdic features:
- `surface_form` - Original text
- `basic_form` - Base/dictionary form
- `pos` - Part of speech (品詞)
- `pos_detail_1`, `pos_detail_2`, `pos_detail_3` - Detailed POS tags
- `conjugated_type` - Conjugation type (活用型)
- `conjugated_form` - Conjugation form (活用形)
- `pronunciation` - Pronunciation
- `reading` - Reading

## Token Filters

### KuromojiBaseFormFilter

Converts tokens to their base/dictionary form.

```typescript
import KuromojiBaseFormFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiBaseFormFilter.js';

const filter = KuromojiBaseFormFilter();
```

**Example:**
- "走った" → "走る"
- "美しい" → "美しい"

### KuromojiPartOfSpeechStopFilter

Removes tokens based on part-of-speech tags.

```typescript
import KuromojiPartOfSpeechStopFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiPartOfSpeechStopFilter.js';

const filter = KuromojiPartOfSpeechStopFilter({
  tags: ['助詞', '助動詞'],  // optional: custom stop tags
});
```

**Default stop tags:**

See [KuromojiPartOfSpeechStopFilter.ts](https://github.com/maruyamaworks/dynamosearch/blob/main/packages/plugin-analysis-kuromoji/src/filters/KuromojiPartOfSpeechStopFilter.ts).

### KuromojiKatakanaStemFilter

Normalizes katakana prolonged sound marks (ー).

```typescript
import KuromojiKatakanaStemFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiKatakanaStemFilter.js';

const filter = KuromojiKatakanaStemFilter();
```

**Example:**
- "コンピューター" → "コンピュータ"
- "サーバー" → "サーバ"

### JapaneseStopFilter

Removes common Japanese stop words.

```typescript
import JapaneseStopFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/JapaneseStopFilter.js';

const filter = JapaneseStopFilter({
  stopwords: ['の', 'に', 'は', 'を'],  // optional: custom stop words
});
```

**Default stop words:**

See [JapaneseStopFilter.ts](https://github.com/maruyamaworks/dynamosearch/blob/main/packages/plugin-analysis-kuromoji/src/filters/JapaneseStopFilter.ts).

## Creating Custom Analyzers

Combine Kuromoji components with other filters:

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer.js';
import KuromojiTokenizer from '@dynamosearch/plugin-analysis-kuromoji/tokenizers/KuromojiTokenizer.js';
import KuromojiBaseFormFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiBaseFormFilter.js';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter.js';

class CustomJapaneseAnalyzer extends Analyzer {
  static async getInstance() {
    return new CustomJapaneseAnalyzer({
      charFilters: [],
      tokenizer: await KuromojiTokenizer.getInstance({ discardPunctuation: false }),
      filters: [
        KuromojiBaseFormFilter(),
        LowerCaseFilter(),
      ],
    });
  }
}
```

## How It Works

Kuromoji performs morphological analysis to break Japanese text into meaningful tokens:

```
Input: "すもももももももものうち"
Tokens: ["すもも", "も", "もも", "も", "もも", "の", "うち"]
```

Without morphological analysis, Japanese text is difficult to search because:
- No word boundaries (spaces) in written text
- Inflected forms need to be normalized (e.g., "走る" vs "走った")
- Particles and auxiliary verbs add noise

KuromojiAnalyzer handles these challenges by:
1. Breaking text into morphemes using the IPAdic dictionary
2. Converting to base forms for consistent matching
3. Filtering out grammatical particles and common stop words
4. Normalizing character widths and katakana variants

## Dictionary

This plugin uses Kuromoji's default IPAdic dictionary, which provides:
- Comprehensive Japanese morpheme coverage
- Part-of-speech tagging
- Reading and pronunciation information
- Conjugation details

## Performance

**Initial Load:**
- First `getInstance()` call loads the IPAdic dictionary (~20MB)
- Subsequent calls reuse the loaded dictionary

**Tokenization:**
- Fast morphological analysis via Viterbi algorithm
- Suitable for real-time indexing from DynamoDB Streams

## Requirements

- Node.js 18+
- `dynamosearch` package
- `kuromoji` library (automatically installed)

## License

MIT
