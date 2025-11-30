# TrimFilter

Removes leading and trailing whitespace from tokens.

## Import

```typescript
import TrimFilter from 'dynamosearch/filters/TrimFilter';
```

## Constructor

```typescript
new TrimFilter()
```

No parameters required.

## Example

```typescript
const filter = new TrimFilter();
const tokens = filter.apply([
  { token: '  hello  ', startOffset: 0, endOffset: 9, position: 0 },
  { token: 'world\t', startOffset: 10, endOffset: 16, position: 1 },
  { token: '\n test ', startOffset: 17, endOffset: 24, position: 2 },
]);
// [
//   { token: 'hello', startOffset: 2, endOffset: 7, position: 0 },
//   { token: 'world', startOffset: 10, endOffset: 15, position: 1 },
//   { token: 'test', startOffset: 18, endOffset: 22, position: 2 }
// ]
```

## Best For

- Cleaning whitespace from tokens
- Normalizing text input
- Processing user input

## See Also

- [LowerCaseFilter](./lowercase-filter.md) - For case normalization
