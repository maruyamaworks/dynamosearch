# JapaneseStopFilter

Removes common Japanese stop words (similar to English stop words filter).

## Import

```typescript
import JapaneseStopFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/JapaneseStopFilter';
```

## Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

## Constructor

```typescript
new JapaneseStopFilter(options?: { stopWords?: Set<string> })
```

### Parameters

- **stopWords** (`Set<string>`, optional) - Words to remove. Defaults to 118 common Japanese stop words.

## Examples

### Default Stop Words

```typescript
const filter = new JapaneseStopFilter();
const tokens = filter.apply([
  { token: 'これ' },
  { token: '素晴らしい' },
  { token: 'です' }
]);
// [
//   { token: '素晴らしい' }
// ]
// 'これ' and 'です' are removed
```

### Custom Stop Words

```typescript
const filter = new JapaneseStopFilter({
  stopWords: new Set(['の', 'に', 'は', 'を'])
});
```

## Default Stop Words

Based on [Apache Lucene's Japanese stopwords](https://github.com/apache/lucene/blob/main/lucene/analysis/kuromoji/src/resources/org/apache/lucene/analysis/ja/stopwords.txt):

Common particles and functional words like:
- の, に, は, を, た, が, で, て, と, し, れ, さ
- ある, いる, も, する, から, な, こと, として
- この, その, あの, これ, それ, あれ
- など, まで, もの, こと, ため
- And many more (118 words total)

## Best For

- Removing very common words that don't add search value
- Reducing index size
- Focusing on meaningful content

## Difference from KuromojiPartOfSpeechStopFilter

::: tip
- **JapaneseStopFilter**: Removes specific words (text-based matching)
- **KuromojiPartOfSpeechStopFilter**: Removes entire grammatical categories (POS-based)

For most use cases, `KuromojiPartOfSpeechStopFilter` is more comprehensive and recommended.
:::

## See Also

- [KuromojiPartOfSpeechStopFilter](./kuromoji-part-of-speech-stop-filter.md) - For POS-based filtering
- [StopFilter](/reference/filters/stop-filter.md) - English equivalent
