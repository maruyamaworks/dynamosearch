# CJKWidthFilter

Normalizes CJK (Chinese, Japanese, Korean) character widths.

## Import

```typescript
import CJKWidthFilter from 'dynamosearch/filters/CJKWidthFilter';
```

## Constructor

```typescript
new CJKWidthFilter()
```

No parameters required.

## Example

```typescript
const filter = new CJKWidthFilter();
const tokens = filter.apply([
  { token: 'ＡＢＣ', startOffset: 0, endOffset: 3, position: 0 }, // Full-width
  { token: 'ａｂｃ', startOffset: 3, endOffset: 6, position: 1 }, // Full-width
  { token: '１２３', startOffset: 6, endOffset: 9, position: 2 }, // Full-width
]);
// [
//   { token: 'ABC', startOffset: 0, endOffset: 3, position: 0 },    // Half-width
//   { token: 'abc', startOffset: 3, endOffset: 6, position: 1 },    // Half-width
//   { token: '123', startOffset: 6, endOffset: 9, position: 2 }     // Half-width
// ]
```

## Conversions

- Half-width katakana → Full-width katakana
- Full-width alphanumeric → Half-width alphanumeric

## Best For

- Japanese text search
- Mixed Japanese/English content
- CJK text normalization

## See Also

- [CJKBigramFilter](./cjk-bigram-filter.md) - For CJK bigrams
