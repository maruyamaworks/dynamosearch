# KuromojiKatakanaStemFilter

Removes trailing prolonged sound marks (ー) from katakana words.

## Import

```typescript
import KuromojiKatakanaStemFilter from '@dynamosearch/plugin-analysis-kuromoji/filters/KuromojiKatakanaStemFilter';
```

## Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

## Constructor

```typescript
new KuromojiKatakanaStemFilter(options?: { minimumLength?: number })
```

### Parameters

- **minimumLength** (`number`, optional) - Only stem katakana words with length ≥ this value (default: `4`)

## Examples

### Default (Minimum Length 4)

```typescript
const filter = new KuromojiKatakanaStemFilter();
const tokens = filter.apply([
  { token: 'コンピューター' },
  { token: 'サーバー' },
  { token: 'カー' },  // Short word
  { token: 'データ' }
]);
// [
//   { token: 'コンピュータ' },  // ー removed
//   { token: 'サーバ' },        // ー removed
//   { token: 'カー' },          // Too short, unchanged
//   { token: 'データ' }         // No ー, unchanged
// ]
```

### Custom Minimum Length

```typescript
const filter = new KuromojiKatakanaStemFilter({ minimumLength: 2 });
const tokens = filter.apply([
  { token: 'カー' }
]);
// [
//   { token: 'カ' }  // Now stemmed because length ≥ 2
// ]
```

## How It Works

For katakana words longer than `minimumLength`, removes the trailing `ー` character if present.

## Examples

| Original | Stemmed | Description |
|----------|---------|-------------|
| コンピューター | コンピュータ | Computer |
| サーバー | サーバ | Server |
| プリンター | プリンタ | Printer |
| ユーザー | ユーザ | User |
| データー | データ | Data |
| センター | センタ | Center |

## Best For

- Normalizing katakana loanword variations
- Matching "コンピューター" and "コンピュータ"
- Handling inconsistent katakana spelling

## Background

In Japanese, katakana loanwords can be spelled with or without the prolonged sound mark (ー). For example:
- コンピューター vs コンピュータ (computer)
- サーバー vs サーバ (server)

This filter normalizes these variations to improve search recall.

## See Also

- [CJKWidthFilter](/reference/filters/cjk-width-filter.md) - For width normalization
- [KuromojiTokenizer](../tokenizers/kuromoji-tokenizer.md)
