# Tokenizer

Abstract base class for implementing custom tokenizers.

## Import

```typescript
import Tokenizer from 'dynamosearch/tokenizers/Tokenizer';
```

## Abstract Methods

```typescript
abstract class Tokenizer {
  abstract tokenize(str: string): Promise<Token[]>;
}
```

### Token Interface

```typescript
interface Token {
  token: string;
  startOffset: number;
  endOffset: number;
  position: number;
  keyword?: boolean;
}
```

## Implementing a Custom Tokenizer

To create a custom tokenizer, extend the `Tokenizer` class and implement the `tokenize` method:

```typescript
import Tokenizer from 'dynamosearch/tokenizers/Tokenizer';

class MyCustomTokenizer extends Tokenizer {
  async tokenize(str: string): Promise<Token[]> {
    // Your tokenization logic here
    return tokens;
  }
}
```

## See Also

- [StandardTokenizer](./standard-tokenizer.md)
- [Analyzer](/reference/analyzers/analyzer.md)
