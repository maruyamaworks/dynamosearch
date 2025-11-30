# Token Filters

Token filters transform or remove tokens after tokenization.

## Base Class

### [TokenFilter](./token-filter.md)

Abstract base class for implementing custom token filters.

## Case Transformation

### [LowerCaseFilter](./lowercase-filter.md)

Converts all tokens to lowercase for case-insensitive search.

### [UpperCaseFilter](./uppercase-filter.md)

Converts all tokens to uppercase.

## Character Normalization

### [CJKWidthFilter](./cjk-width-filter.md)

Normalizes CJK (Chinese, Japanese, Korean) character widths.

### [ASCIIFoldingFilter](./ascii-folding-filter.md)

Converts accented characters to their ASCII equivalents.

## Stop Words and Filtering

### [StopFilter](./stop-filter.md)

Removes stop words from the token stream.

### [KeepWordFilter](./keep-word-filter.md)

Keeps only tokens that match a specified word list.

## Length Filtering

### [LengthFilter](./length-filter.md)

Filters out tokens outside a specified length range.

### [TruncateFilter](./truncate-filter.md)

Truncates tokens exceeding a specified length.

### [LimitTokenCountFilter](./limit-token-count-filter.md)

Limits the total number of tokens output.

## String Manipulation

### [TrimFilter](./trim-filter.md)

Removes leading and trailing whitespace from tokens.

### [ReverseStringFilter](./reverse-string-filter.md)

Reverses each token character-by-character.

## Stemming

### [PorterStemFilter](./porter-stem-filter.md)

Applies Porter stemming algorithm for English.

### [SnowballFilter](./snowball-filter.md)

Applies Snowball stemming algorithm for multiple languages.

## Language-Specific

### [ElisionFilter](./elision-filter.md)

Removes elisions (e.g., l', d' in French).

### [ApostropheFilter](./apostrophe-filter.md)

Removes apostrophes and text after apostrophes.

### [EnglishPossessiveFilter](./english-possessive-filter.md)

Removes English possessive suffixes ('s).

## N-Grams and Shingles

### [NGramTokenFilter](./ngram-token-filter.md)

Generates n-grams from tokens at the token level.

### [EdgeNGramTokenFilter](./edge-ngram-token-filter.md)

Generates edge n-grams from the beginning of each token.

### [ShingleFilter](./shingle-filter.md)

Creates word shingles (multi-word tokens) from consecutive tokens.

### [CJKBigramFilter](./cjk-bigram-filter.md)

Forms bigrams of CJK (Chinese, Japanese, Korean) characters.

### [CommonGramsFilter](./common-grams-filter.md)

Generates bigrams for frequently occurring terms.

## Deduplication

### [UniqueFilter](./unique-filter.md)

Removes duplicate tokens from the token stream.

### [RemoveDuplicatesTokenFilter](./remove-duplicates-token-filter.md)

Removes duplicate tokens at the same position.

## Keyword Handling

### [KeywordRepeatFilter](./keyword-repeat-filter.md)

Marks tokens as keywords and repeats them for dual processing.

### [KeywordMarkerFilter](./keyword-marker-filter.md)

Marks specified tokens as keywords to protect them from stemming.

## Conditional

### [ConditionalTokenFilter](./conditional-token-filter.md)

Applies a token filter conditionally based on a predicate function.
