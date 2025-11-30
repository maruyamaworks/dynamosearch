# Token Filters

Token filters for Japanese text analysis provided by the kuromoji plugin.

## Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

## Available Token Filters

### [KuromojiBaseFormFilter](./kuromoji-base-form-filter.md)

Converts tokens to their base (dictionary) form using morphological analysis.

**Best for:** Improving recall by matching different word forms, Japanese verb and adjective normalization

### [KuromojiPartOfSpeechStopFilter](./kuromoji-part-of-speech-stop-filter.md)

Removes tokens based on their part-of-speech tags.

**Best for:** Removing grammatical particles and function words, focusing on content words, improving precision

### [JapaneseStopFilter](./japanese-stop-filter.md)

Removes common Japanese stop words (similar to English stop words filter).

**Best for:** Removing very common words, reducing index size, focusing on meaningful content

### [KuromojiKatakanaStemFilter](./kuromoji-katakana-stem-filter.md)

Removes trailing prolonged sound marks (ー) from katakana words.

**Best for:** Normalizing katakana loanword variations, handling inconsistent katakana spelling
