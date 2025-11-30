# KeywordAnalyzer

Treats the entire input as a single token for exact matching.

## Import

```typescript
import KeywordAnalyzer from 'dynamosearch/analyzers/KeywordAnalyzer';
```

## Constructor

```typescript
new KeywordAnalyzer()
```

No parameters required.

## Pipeline

- **Tokenizer**: `KeywordTokenizer`
- **Filters**: None

## Example

```typescript
const analyzer = new KeywordAnalyzer();
const tokens = await analyzer.analyze('product-123-abc');
// [
//   { token: 'product-123-abc', startOffset: 0, endOffset: 15, position: 0 }
// ]
```

## Behavior

- Returns entire input as single token
- Preserves all characters (spaces, punctuation, etc.)
- Case-sensitive (preserves original case)
- No normalization applied

## Best For

- IDs and identifiers
- Categories and tags
- Exact string matching
- Status values
- Enum-like fields

## Use Cases

```typescript
// Product codes
await analyzer.analyze('SKU-ABC-123');
// [{ token: 'SKU-ABC-123', ... }]

// Status values
await analyzer.analyze('in-progress');
// [{ token: 'in-progress', ... }]

// Categories
await analyzer.analyze('electronics/computers/laptops');
// [{ token: 'electronics/computers/laptops', ... }]
```

## See Also

- [WhitespaceAnalyzer](./whitespace-analyzer.md) - For splitting on whitespace
- [PatternAnalyzer](./pattern-analyzer.md) - For custom pattern-based splitting
