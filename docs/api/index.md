# API Reference

Complete API documentation for DynamoSearch.

## Main Classes

- [DynamoSearch](/api/dynamosearch) - Core search class
- [Analyzers](/api/analyzers) - Text analysis components
- [Tokenizers](/api/tokenizers) - Text tokenization
- [Filters](/api/filters) - Token and character filters

## Quick Links

### DynamoSearch Methods

- [`constructor(options)`](/api/dynamosearch#constructor)
- [`createIndexTable(options)`](/api/dynamosearch#createindextable)
- [`deleteIndexTable(options)`](/api/dynamosearch#deleteindextable)
- [`processRecords(records)`](/api/dynamosearch#processrecords)
- [`search(query, options)`](/api/dynamosearch#search)
- [`reindex(items)`](/api/dynamosearch#reindex)
- [`getMetadata()`](/api/dynamosearch#getmetadata)

### Built-in Analyzers

- [`StandardAnalyzer`](/api/analyzers#standardanalyzer) - English text analysis
- [`KeywordAnalyzer`](/api/analyzers#keywordanalyzer) - Exact matching
- [`JapaneseAnalyzer`](/api/analyzers#japaneseanalyzer) - Japanese text (plugin)

### Built-in Tokenizers

- [`StandardTokenizer`](/api/tokenizers#standardtokenizer) - Word boundaries
- [`KeywordTokenizer`](/api/tokenizers#keywordtokenizer) - Single token
- [`NGramTokenizer`](/api/tokenizers#ngramtokenizer) - N-gram generation
- [`PathHierarchyTokenizer`](/api/tokenizers#pathhierarchytokenizer) - Path splitting

### Built-in Filters

- [`LowerCaseFilter`](/api/filters#lowercasefilter) - Lowercase conversion
- [`CJKWidthFilter`](/api/filters#cjkwidthfilter) - CJK normalization

## Type Definitions

```typescript
interface Options {
  indexTableName: string;
  attributes: Attribute[];
  keys: Key[];
}

interface Attribute {
  name: string;
  analyzer: Analyzer;
  shortName?: string;
  boost?: number;
}

interface Key {
  name: string;
  type: 'HASH' | 'RANGE';
}

interface SearchOptions {
  attributes?: string[];
  maxItems?: number;
  minScore?: number;
  bm25?: BM25Params;
}

interface BM25Params {
  k1?: number;
  b?: number;
}

interface SearchResult {
  items: SearchResultItem[];
  consumedCapacity: {
    capacityUnits: number;
    tableName: string;
  };
}

interface SearchResultItem {
  keys: Record<string, AttributeValue>;
  score: number;
}
```

## Next Steps

- [DynamoSearch Class](/api/dynamosearch) - Detailed class reference
- [Analyzers](/api/analyzers) - Text analysis API
- [Quick Start](/guide/quick-start) - Build your first app
