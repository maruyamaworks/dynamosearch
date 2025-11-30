# CharacterFilter

Abstract base class for implementing custom character filters.

## Import

```typescript
import CharacterFilter from 'dynamosearch/char_filters/CharacterFilter';
```

## Type Definition

```typescript
abstract class CharacterFilter {
  abstract apply(str: string): string;
}
```

## Implementing a Custom Character Filter

To create a custom character filter, extend the `CharacterFilter` class and implement the `apply` method:

```typescript
import CharacterFilter from 'dynamosearch/char_filters/CharacterFilter';

class MyCustomCharFilter extends CharacterFilter {
  apply(str: string): string {
    // Your transformation logic here
    return transformedString;
  }
}
```

## Example

```typescript
class UpperCaseCharFilter extends CharacterFilter {
  apply(str: string): string {
    return str.toUpperCase();
  }
}

const filter = new UpperCaseCharFilter();
const result = filter.apply('hello world');
// 'HELLO WORLD'
```

## See Also

- [ICUNormalizer](./icu-normalizer.md)
- [Analyzer](/reference/analyzers/analyzer.md)
