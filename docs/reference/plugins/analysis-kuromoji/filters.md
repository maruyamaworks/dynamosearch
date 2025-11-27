# Token Filters

Token filters for Japanese text analysis provided by the kuromoji plugin.

## Type Definition

```typescript
abstract class TokenFilter {
  abstract apply(tokens: { text: string; metadata?: IpadicFeatures }[]): { text: string; metadata?: IpadicFeatures }[];
}
```

Kuromoji token filters work with tokens that may include metadata from morphological analysis (part of speech, base form, etc.).

## KuromojiBaseFormFilter

Converts tokens to their base (dictionary) form using morphological analysis.

```typescript
import KuromojiBaseFormFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiBaseFormFilter';
```

### Usage

```typescript
const filter = new KuromojiBaseFormFilter();
const tokens = filter.apply([
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
import KuromojiPartOfSpeechStopFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiPartOfSpeechStopFilter';
```

### Usage

```typescript
// Use default stop tags
const filter = new KuromojiPartOfSpeechStopFilter();
const tokens = filter.apply([
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
const customFilter = new KuromojiPartOfSpeechStopFilter({
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
import JapaneseStopFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/JapaneseStopFilter';
```

### Usage

```typescript
// Use default stop words
const filter = new JapaneseStopFilter();
const tokens = filter.apply([
  { text: 'これ' },
  { text: '素晴らしい' },
  { text: 'です' }
]);
// [{ text: '素晴らしい' }]
// 'これ' and 'です' are removed

// Custom stop words
const customFilter = new JapaneseStopFilter({
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
import KuromojiKatakanaStemFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiKatakanaStemFilter';
```

### Usage

```typescript
// Default: minimum length 4
const filter = new KuromojiKatakanaStemFilter();
const tokens = filter.apply([
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
const shortFilter = new KuromojiKatakanaStemFilter({ minimumLength: 2 });
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
