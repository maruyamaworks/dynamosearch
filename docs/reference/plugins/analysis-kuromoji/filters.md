# Token Filters

Token filters for Japanese text analysis provided by the kuromoji plugin.

## Type Definition

```typescript
type TokenFilter = (tokens: { text: string; metadata?: IpadicFeatures }[]) => { text: string; metadata?: IpadicFeatures }[];
```

Kuromoji token filters work with tokens that may include metadata from morphological analysis (part of speech, base form, etc.).

## KuromojiBaseFormFilter

Converts tokens to their base (dictionary) form using morphological analysis.

```typescript
import KuromojiBaseFormFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiBaseFormFilter.js';
```

### Usage

```typescript
const filter = KuromojiBaseFormFilter();
const tokens = filter([
  { text: '走った', metadata: { basic_form: '走る', /* ... */ } },
  { text: '食べる', metadata: { basic_form: '*', /* ... */ } },
  { text: '美しい', metadata: { basic_form: '美しい', /* ... */ } }
]);
// [
//   { text: '走る', metadata: { ... } },    // Past tense → Base form
//   { text: '食べる', metadata: { ... } },  // No change (already base form)
//   { text: '美しい', metadata: { ... } }   // No change
// ]
```

### How It Works

- Uses the `basic_form` field from kuromoji metadata
- If `basic_form` is missing or `'*'`, keeps the original token
- Normalizes verb conjugations, adjective forms, and inflections

### Best For

- Improving recall by matching different word forms
- Japanese verb and adjective normalization
- Search that should match regardless of conjugation

## KuromojiPartOfSpeechStopFilter

Removes tokens based on their part-of-speech tags.

```typescript
import KuromojiPartOfSpeechStopFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiPartOfSpeechStopFilter.js';
```

### Usage

```typescript
// Use default stop tags
const filter = KuromojiPartOfSpeechStopFilter();
const tokens = filter([
  { text: '東京', metadata: { pos: '名詞', pos_detail_1: '固有名詞', /* ... */ } },
  { text: 'の', metadata: { pos: '助詞', pos_detail_1: '連体化', /* ... */ } },
  { text: '空', metadata: { pos: '名詞', pos_detail_1: '一般', /* ... */ } }
]);
// [
//   { text: '東京', metadata: { ... } },
//   { text: '空', metadata: { ... } }
// ]
// 'の' (particle) is removed

// Custom stop tags
const customFilter = KuromojiPartOfSpeechStopFilter({
  stopTags: new Set(['助詞', '助動詞'])
});
```

### Default Stop Tags

Based on [Apache Lucene's Japanese stop tags](https://github.com/apache/lucene/blob/main/lucene/analysis/kuromoji/src/resources/org/apache/lucene/analysis/ja/stoptags.txt):

- **助詞** (Particles): 格助詞, 接続助詞, 係助詞, 副助詞, etc.
- **助動詞** (Auxiliary verbs)
- **記号** (Symbols): 読点, 句点, 空白, 括弧, etc.
- **その他**: 間投, フィラー, 非言語音

### Options

- **stopTags** (`Set<string>`, optional) - Part-of-speech tags to remove. Defaults to predefined list.

### How It Works

Constructs a POS tag by joining `pos`, `pos_detail_1`, `pos_detail_2`, `pos_detail_3` with hyphens (e.g., `助詞-格助詞-一般`), then checks against the stop tags set.

### Best For

- Removing grammatical particles and function words
- Focusing on content words (nouns, verbs, adjectives)
- Improving precision by filtering noise

## JapaneseStopFilter

Removes common Japanese stop words (similar to English stop words filter).

```typescript
import JapaneseStopFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/JapaneseStopFilter.js';
```

### Usage

```typescript
// Use default stop words
const filter = JapaneseStopFilter();
const tokens = filter([
  { text: 'これ' },
  { text: '素晴らしい' },
  { text: 'です' }
]);
// [{ text: '素晴らしい' }]
// 'これ' and 'です' are removed

// Custom stop words
const customFilter = JapaneseStopFilter({
  stopWords: new Set(['の', 'に', 'は', 'を'])
});
```

### Default Stop Words

Based on [Apache Lucene's Japanese stopwords](https://github.com/apache/lucene/blob/main/lucene/analysis/kuromoji/src/resources/org/apache/lucene/analysis/ja/stopwords.txt):

Common particles and functional words like: の, に, は, を, た, が, で, て, と, し, れ, さ, ある, いる, も, する, から, な, こと, として, etc.

### Options

- **stopWords** (`Set<string>`, optional) - Words to remove. Defaults to 118 common Japanese stop words.

### Best For

- Removing very common words that don't add search value
- Reducing index size
- Focusing on meaningful content

### Note

::: tip Difference from KuromojiPartOfSpeechStopFilter
- **JapaneseStopFilter**: Removes specific words (text-based matching)
- **KuromojiPartOfSpeechStopFilter**: Removes entire grammatical categories (POS-based)

For most use cases, `KuromojiPartOfSpeechStopFilter` is more comprehensive and recommended.
:::

## KuromojiKatakanaStemFilter

Removes trailing prolonged sound marks (ー) from katakana words.

```typescript
import KuromojiKatakanaStemFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiKatakanaStemFilter.js';
```

### Usage

```typescript
// Default: minimum length 4
const filter = KuromojiKatakanaStemFilter();
const tokens = filter([
  { text: 'コンピューター' },
  { text: 'サーバー' },
  { text: 'カー' },  // Short word
  { text: 'データ' }
]);
// [
//   { text: 'コンピュータ' },  // ー removed
//   { text: 'サーバ' },        // ー removed
//   { text: 'カー' },          // Too short, unchanged
//   { text: 'データ' }         // No ー, unchanged
// ]

// Custom minimum length
const shortFilter = KuromojiKatakanaStemFilter({ minimumLength: 2 });
```

### Options

- **minimumLength** (`number`, default: `4`) - Only stem katakana words with length ≥ this value

### How It Works

For katakana words longer than `minimumLength`, removes the trailing `ー` character if present.

### Best For

- Normalizing katakana loanword variations
- Matching "コンピューター" and "コンピュータ"
- Handling inconsistent katakana spelling

### Examples

| Original | Stemmed |
|----------|---------|
| コンピューター | コンピュータ |
| サーバー | サーバ |
| プリンター | プリンタ |
| ユーザー | ユーザ |

## Filter Chains

Combine multiple filters for comprehensive Japanese text processing:

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer.js';
import KuromojiTokenizer from '@dynamosearch/plugin-analysis-kuromoji/tokenizers/KuromojiTokenizer.js';
import KuromojiBaseFormFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiBaseFormFilter.js';
import KuromojiPartOfSpeechStopFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiPartOfSpeechStopFilter.js';
import JapaneseStopFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/JapaneseStopFilter.js';
import KuromojiKatakanaStemFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiKatakanaStemFilter.js';
import CJKWidthFilter from 'dynamosearch/filters/CJKWidthFilter.js';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter.js';

class CustomJapaneseAnalyzer extends Analyzer {
  static async getInstance() {
    return new CustomJapaneseAnalyzer({
      charFilters: [],
      tokenizer: await KuromojiTokenizer.getInstance(),
      filters: [
        KuromojiBaseFormFilter(),              // Normalize to base form
        KuromojiPartOfSpeechStopFilter(),      // Remove particles/symbols
        CJKWidthFilter(),                       // Normalize character width
        JapaneseStopFilter(),                   // Remove stop words
        KuromojiKatakanaStemFilter(),          // Normalize katakana
        LowerCaseFilter()                       // Lowercase (for alphanumeric)
      ]
    });
  }
}
```

### Recommended Filter Order

1. **KuromojiBaseFormFilter** - First, normalize word forms
2. **KuromojiPartOfSpeechStopFilter** - Remove grammatical noise
3. **CJKWidthFilter** - Normalize character widths
4. **JapaneseStopFilter** - Remove common stop words (optional)
5. **KuromojiKatakanaStemFilter** - Normalize katakana
6. **LowerCaseFilter** - Lowercase remaining tokens

This is the default configuration used by `KuromojiAnalyzer`.

## Custom Filters

You can create custom filters that work with kuromoji metadata:

### Reading-based Filter

Filter by pronunciation (reading):

```typescript
const katakanaOnlyFilter = () => (tokens: { text: string; metadata?: IpadicFeatures }[]) => {
  return tokens.filter(token => {
    if (!token.metadata?.reading) return true;
    // Only keep tokens with katakana readings (foreign words)
    return /^[\u30A0-\u30FF]+$/.test(token.metadata.reading);
  });
};
```

### Noun-only Filter

Keep only nouns:

```typescript
const nounOnlyFilter = () => (tokens: { text: string; metadata?: IpadicFeatures }[]) => {
  return tokens.filter(token => {
    if (!token.metadata?.pos) return true;
    return token.metadata.pos === '名詞';
  });
};
```

### Compound Noun Merger

Merge consecutive nouns:

```typescript
const compoundNounFilter = () => (tokens: { text: string; metadata?: IpadicFeatures }[]) => {
  const result: typeof tokens = [];
  let compound = '';

  for (const token of tokens) {
    if (token.metadata?.pos === '名詞') {
      compound += token.text;
    } else {
      if (compound) {
        result.push({ text: compound });
        compound = '';
      }
      result.push(token);
    }
  }

  if (compound) {
    result.push({ text: compound });
  }

  return result;
};
```

## See Also

- [Tokenizers](./tokenizers.md) - Japanese tokenization
- [Analyzers](./analyzers.md) - Complete analysis pipeline
- [Core Filters](../../filters.md) - Language-agnostic filters
