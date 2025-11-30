# ElisionFilter

Removes elisions (e.g., l', d' in French).

## Import

```typescript
import ElisionFilter from 'dynamosearch/filters/ElisionFilter';
```

## Constructor

```typescript
new ElisionFilter(options?: { articles?: string[] })
```

### Parameters

- **articles** (`string[]`, optional) - Array of elision articles to remove

## Example

```typescript
const filter = new ElisionFilter();
const tokens = filter.apply([
  { token: "l'homme", startOffset: 0, endOffset: 7, position: 0 },
  { token: "d'abord", startOffset: 8, endOffset: 15, position: 1 },
]);
// [
//   { token: 'homme', startOffset: 2, endOffset: 7, position: 0 },
//   { token: 'abord', startOffset: 10, endOffset: 15, position: 1 }
// ]
```

## Best For

- French text processing
- Removing French elisions (l', d', qu', etc.)
- French language search

## See Also

- [FrenchAnalyzer](/reference/analyzers/french-analyzer.md) - Uses this filter
- [ApostropheFilter](./apostrophe-filter.md) - For general apostrophe handling
