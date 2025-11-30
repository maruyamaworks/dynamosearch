# LowerCaseFilter

Converts all tokens to lowercase.

## Import

```typescript
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';
```

## Constructor

```typescript
new LowerCaseFilter()
```

No parameters required.

## Example

```typescript
const filter = new LowerCaseFilter();
const tokens = filter.apply([
  { token: 'Hello', startOffset: 0, endOffset: 5, position: 0 },
  { token: 'WORLD', startOffset: 6, endOffset: 11, position: 1 },
  { token: 'JavaScript', startOffset: 12, endOffset: 22, position: 2 },
]);
// [
//   { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'world', startOffset: 6, endOffset: 11, position: 1 },
//   { token: 'javascript', startOffset: 12, endOffset: 22, position: 2 }
// ]
```

## Best For

- Case-insensitive search
- Normalizing English text
- Most text search applications

## See Also

- [UpperCaseFilter](./uppercase-filter.md) - For uppercase conversion
- [StandardAnalyzer](/reference/analyzers/standard-analyzer.md) - Uses this filter
