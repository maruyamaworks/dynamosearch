# Tokenizers

Tokenizers split text into individual tokens for indexing and searching.

## Available Tokenizers

### [Tokenizer](./tokenizer.md)

Abstract base class for implementing custom tokenizers.

### [StandardTokenizer](./standard-tokenizer.md)

Word-based tokenization that splits on hyphens, spaces, commas, and periods.

**Best for:** English and Western languages, general text tokenization, word-based search

### [IntlSegmenterTokenizer](./intl-segmenter-tokenizer.md)

Locale-aware word segmentation using JavaScript `Intl.Segmenter` API.

**Best for:** Multilingual text, languages without spaces (Chinese, Japanese, Thai), locale-specific word boundaries

### [KeywordTokenizer](./keyword-tokenizer.md)

Returns the entire input as a single token.

**Best for:** Exact string matching, IDs and identifiers, categories and tags

### [LetterTokenizer](./letter-tokenizer.md)

Splits on non-letter characters using Unicode letter property.

**Best for:** Extracting letter sequences, international text, when numbers/punctuation should be removed

### [LowerCaseTokenizer](./lowercase-tokenizer.md)

Splits on non-letter characters and lowercases each token.

**Best for:** Case-insensitive search, letter-only tokenization, simple text analysis

### [WhitespaceTokenizer](./whitespace-tokenizer.md)

Splits text on whitespace characters.

**Best for:** Preserving punctuation, pre-tokenized input, space-delimited data

### [NGramTokenizer](./ngram-tokenizer.md)

Generates character n-grams for partial matching.

**Best for:** Partial/substring matching, autocomplete suggestions, fuzzy matching, search-as-you-type

### [PathHierarchyTokenizer](./path-hierarchy-tokenizer.md)

Splits paths into hierarchical components.

**Best for:** File system paths, URL paths, package names, hierarchical identifiers

### [PatternTokenizer](./pattern-tokenizer.md)

Flexible regex-based tokenization with split or capture modes.

**Best for:** Custom tokenization patterns, complex text parsing, domain-specific formats

### [SimplePatternTokenizer](./simple-pattern-tokenizer.md)

Captures text matching a pattern as tokens.

**Best for:** Extracting specific patterns, number extraction, simple pattern matching

### [SimplePatternSplitTokenizer](./simple-pattern-split-tokenizer.md)

Splits input at pattern matches.

**Best for:** Custom delimiters, CSV-like data, simple splitting logic

### [URLEmailTokenizer](./urlemail-tokenizer.md)

Preserves URLs and email addresses as complete tokens.

**Best for:** Content with URLs, email address extraction, web content indexing
