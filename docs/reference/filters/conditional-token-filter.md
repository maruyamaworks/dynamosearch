# ConditionalTokenFilter

Applies a token filter conditionally based on a predicate function.

## Import

```typescript
import ConditionalTokenFilter from 'dynamosearch/filters/ConditionalTokenFilter';
```

## Constructor

```typescript
new ConditionalTokenFilter(options: {
  filter: TokenFilter;
  condition: (token: Token) => boolean;
})
```

### Parameters

- **filter** (`TokenFilter`) - The filter to apply conditionally
- **condition** (`(token: Token) => boolean`) - Predicate function to determine if filter should be applied

## Example

```typescript
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';

const filter = new ConditionalTokenFilter({
  filter: new LowerCaseFilter(),
  condition: (token) => token.token.length > 3,
});

const tokens = filter.apply([
  { token: 'HELLO', startOffset: 0, endOffset: 5, position: 0 }, // length > 3, lowercased
  { token: 'HI', startOffset: 6, endOffset: 8, position: 1 },    // length <= 3, unchanged
]);
// [
//   { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'HI', startOffset: 6, endOffset: 8, position: 1 }
// ]
```

## Best For

- Conditional token processing
- Complex filtering logic
- Applying filters selectively

## See Also

- [TokenFilter](./token-filter.md) - Base class for filters
