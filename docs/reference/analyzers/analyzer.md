# Analyzer

Base class for creating custom analyzers.

## Import

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer';
```

## Constructor

```typescript
new Analyzer(options: AnalyzerOptions)
```

Creates a custom analyzer with specified components.

### Parameters

- **tokenizer** (`Tokenizer`) - Tokenizer instance
- **charFilters** (`CharacterFilter[]`, optional) - Array of character filters
- **filters** (`TokenFilter[]`, optional) - Array of token filters

## Methods

### analyze()

```typescript
analyze(str: string): Promise<Token[]>
```

Analyzes text and returns array of tokens.

#### Parameters

- **str** (`string`) - Text to analyze

#### Returns

Promise resolving to array of token objects:

```typescript
interface Token {
  token: string;
  startOffset: number;
  endOffset: number;
  position: number;
  keyword?: boolean;
}
```

## Example

```typescript
import Analyzer from 'dynamosearch/analyzers/Analyzer';
import StandardTokenizer from 'dynamosearch/tokenizers/StandardTokenizer';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';

const analyzer = new Analyzer({
  charFilters: [],
  tokenizer: new StandardTokenizer(),
  filters: [new LowerCaseFilter()],
});

const tokens = await analyzer.analyze('Hello World!');
// [
//   { token: 'hello', startOffset: 0, endOffset: 5, position: 0 },
//   { token: 'world', startOffset: 6, endOffset: 11, position: 1 }
// ]
```

## Use Cases

- Creating custom text analysis pipelines
- Combining multiple tokenizers and filters
- Domain-specific text processing

## See Also

- [StandardAnalyzer](./standard-analyzer.md)
- [Tokenizers](/reference/tokenizers/)
- [Token Filters](/reference/filters/)
- [Character Filters](/reference/char-filters/)
