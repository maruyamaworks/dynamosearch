# UpperCaseFilter

Converts all tokens to uppercase.

## Import

```typescript
import UpperCaseFilter from 'dynamosearch/filters/UpperCaseFilter';
```

## Constructor

```typescript
new UpperCaseFilter()
```

No parameters required.

## Example

```typescript
const filter = new UpperCaseFilter();
const tokens = filter.apply([
  { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
  { token: 'world', startOffset: 6, endOffset: 11, position: 1 },
  { token: 'JavaScript', startOffset: 12, endOffset: 22, position: 2 },
]);
// [
//   { token: 'HELLO', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'WORLD', startOffset: 6, endOffset: 11, position: 1 },
//   { token: 'JAVASCRIPT', startOffset: 12, endOffset: 22, position: 2 }
// ]
```

## Best For

- Uppercase normalization
- Legacy system integration
- Special display requirements

## See Also

- [LowerCaseFilter](./lowercase-filter.md) - For lowercase conversion
