# TokenFilter

Abstract base class for implementing custom token filters.

## Import

```typescript
import TokenFilter from 'dynamosearch/filters/TokenFilter';
```

## Type Definition

```typescript
abstract class TokenFilter {
  abstract apply(tokens: Token[]): Token[];
}

interface Token {
  token: string;
  startOffset: number;
  endOffset: number;
  position: number;
  keyword?: boolean;
}
```

## Implementing a Custom Filter

To create a custom token filter, extend the `TokenFilter` class and implement the `apply` method:

```typescript
import TokenFilter from 'dynamosearch/filters/TokenFilter';

class MyCustomFilter extends TokenFilter {
  apply(tokens: Token[]): Token[] {
    // Your transformation logic here
    return transformedTokens;
  }
}
```

## See Also

- [LowerCaseFilter](./lowercase-filter.md)
- [Analyzer](/reference/analyzers/analyzer.md)
