# CJKBigramFilter

Forms bigrams of CJK (Chinese, Japanese, Korean) characters for improved CJK search.

## Import

```typescript
import CJKBigramFilter from 'dynamosearch/filters/CJKBigramFilter';
```

## Constructor

```typescript
new CJKBigramFilter()
```

No parameters required.

## Example

```typescript
const filter = new CJKBigramFilter();
const tokens = filter.apply([
  { token: '東京', startOffset: 0, endOffset: 2, position: 0 },
]);
// Generates bigrams for CJK characters
```

## Best For

- CJK text search
- Chinese, Japanese, Korean languages
- Improving CJK search accuracy

## See Also

- [CJKWidthFilter](./cjk-width-filter.md) - For CJK width normalization
- [ShingleFilter](./shingle-filter.md) - For word shingles
