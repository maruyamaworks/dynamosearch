# Analyzers

Analyzers convert text into searchable tokens through a pipeline of character filters, tokenizer, and token filters.

## Available Analyzers

### [Analyzer](./analyzer.md)

Base class for creating custom analyzers with specified character filters, tokenizer, and token filters.

### [StandardAnalyzer](./standard-analyzer.md)

English text analyzer with word tokenization, lowercase normalization, and optional stop word filtering.

**Best for:** English text, Western languages, general text search

### [SimpleAnalyzer](./simple-analyzer.md)

Letter-based tokenization with automatic lowercasing.

**Best for:** Simple text tokenization, case-insensitive search without stop words

### [WhitespaceAnalyzer](./whitespace-analyzer.md)

Splits text on whitespace characters.

**Best for:** Preserving punctuation and special characters, pre-tokenized input

### [KeywordAnalyzer](./keyword-analyzer.md)

Treats the entire input as a single token for exact matching.

**Best for:** IDs and identifiers, categories and tags, exact string matching

### [StopAnalyzer](./stop-analyzer.md)

Letter-based tokenization with lowercasing and stop word filtering.

**Best for:** English text with stop word removal, reducing index size

### [PatternAnalyzer](./pattern-analyzer.md)

Regex-based tokenization with optional lowercasing and stop word filtering.

**Best for:** Custom tokenization patterns, domain-specific text formats

### [EnglishAnalyzer](./english-analyzer.md)

Optimized analyzer for English text with stemming and stop word filtering.

**Best for:** English text search with stemming, handling English word variations

### [FrenchAnalyzer](./french-analyzer.md)

Optimized analyzer for French text with elision and stemming support.

**Best for:** French text search, handling French elisions

### [SpanishAnalyzer](./spanish-analyzer.md)

Optimized analyzer for Spanish text with stemming support.

**Best for:** Spanish text search, Spanish word stemming
