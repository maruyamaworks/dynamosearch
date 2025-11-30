# PathHierarchyTokenizer

Splits paths into hierarchical components.

## Import

```typescript
import PathHierarchyTokenizer from 'dynamosearch/tokenizers/PathHierarchyTokenizer';
```

## Constructor

```typescript
new PathHierarchyTokenizer(options?: { delimiter?: string })
```

### Parameters

- **delimiter** (`string`, optional) - Path delimiter (default: `'/'`)

## Examples

### File System Paths

```typescript
const tokenizer = new PathHierarchyTokenizer({ delimiter: '/' });
const tokens = await tokenizer.tokenize('/usr/local/bin/node');
// [
//   { token: '/usr', startOffset: 0, endOffset: 4, position: 0 },
//   { token: '/usr/local', startOffset: 0, endOffset: 10, position: 1 },
//   { token: '/usr/local/bin', startOffset: 0, endOffset: 14, position: 2 },
//   { token: '/usr/local/bin/node', startOffset: 0, endOffset: 19, position: 3 }
// ]
```

### Package Names

```typescript
const tokenizer = new PathHierarchyTokenizer({ delimiter: '.' });
const tokens = await tokenizer.tokenize('com.example.app.MainActivity');
// [
//   { token: 'com', startOffset: 0, endOffset: 3, position: 0 },
//   { token: 'com.example', startOffset: 0, endOffset: 11, position: 1 },
//   { token: 'com.example.app', startOffset: 0, endOffset: 15, position: 2 },
//   { token: 'com.example.app.MainActivity', startOffset: 0, endOffset: 28, position: 3 }
// ]
```

## Behavior

- Generates hierarchical tokens from root to leaf
- Each token includes all parent components
- Useful for hierarchical searching

## Best For

- File system paths
- URL paths
- Package names
- Hierarchical identifiers
- Category hierarchies

## See Also

- [KeywordTokenizer](./keyword-tokenizer.md) - For exact matching
- [PatternTokenizer](./pattern-tokenizer.md) - For custom pattern splitting
