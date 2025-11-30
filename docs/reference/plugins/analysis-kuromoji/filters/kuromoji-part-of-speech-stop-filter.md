# KuromojiPartOfSpeechStopFilter

Removes tokens based on their part-of-speech tags.

## Import

```typescript
import KuromojiPartOfSpeechStopFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiPartOfSpeechStopFilter';
```

## Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

## Constructor

```typescript
new KuromojiPartOfSpeechStopFilter(options?: { stopTags?: Set<string> })
```

### Parameters

- **stopTags** (`Set<string>`, optional) - Part-of-speech tags to remove. Defaults to predefined list.

## Examples

### Default Stop Tags

```typescript
const filter = new KuromojiPartOfSpeechStopFilter();
const tokens = filter.apply([
  { token: '東京', metadata: { pos: '名詞', pos_detail_1: '固有名詞' } },
  { token: 'の', metadata: { pos: '助詞', pos_detail_1: '連体化' } },
  { token: '空', metadata: { pos: '名詞', pos_detail_1: '一般' } }
]);
// [
//   { token: '東京', metadata: { pos: '名詞', pos_detail_1: '固有名詞' } },
//   { token: '空', metadata: { pos: '名詞', pos_detail_1: '一般' } }
// ]
// 'の' (particle) is removed
```

### Custom Stop Tags

```typescript
const filter = new KuromojiPartOfSpeechStopFilter({
  stopTags: new Set(['助詞', '助動詞'])
});
```

## Default Stop Tags

Based on [Apache Lucene's Japanese stop tags](https://github.com/apache/lucene/blob/main/lucene/analysis/kuromoji/src/resources/org/apache/lucene/analysis/ja/stoptags.txt):

### Particles (助詞)
- 格助詞 (Case particles)
- 接続助詞 (Conjunctive particles)
- 係助詞 (Binding particles)
- 副助詞 (Adverbial particles)
- 並立助詞 (Parallel particles)
- 終助詞 (Sentence-ending particles)

### Auxiliary Verbs (助動詞)
All auxiliary verb types

### Symbols (記号)
- 読点 (Comma)
- 句点 (Period)
- 空白 (Whitespace)
- 括弧開 (Opening bracket)
- 括弧閉 (Closing bracket)

### Others
- 間投 (Interjections)
- フィラー (Fillers)
- 非言語音 (Non-linguistic sounds)

## How It Works

Constructs a POS tag by joining `pos`, `pos_detail_1`, `pos_detail_2`, `pos_detail_3` with hyphens (e.g., `助詞-格助詞-一般`), then checks against the stop tags set.

## Best For

- Removing grammatical particles and function words
- Focusing on content words (nouns, verbs, adjectives)
- Improving precision by filtering noise

## See Also

- [JapaneseStopFilter](./japanese-stop-filter.md) - For word-based stop filtering
- [KuromojiTokenizer](../tokenizers/kuromoji-tokenizer.md) - Provides POS metadata
- [StopFilter](/reference/filters/stop-filter.md) - English equivalent
