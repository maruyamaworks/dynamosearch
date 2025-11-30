# Analyzers

Analyzers for Japanese text analysis provided by the kuromoji plugin.

## Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

## Available Analyzers

### [KuromojiAnalyzer](./kuromoji-analyzer.md)

Japanese text analyzer using Kuromoji morphological analysis.

**Pipeline:**
- Tokenizer: `KuromojiTokenizer`
- Filters: `LowerCaseFilter`, `CJKWidthFilter`

**Best for:** Japanese text, mixed Japanese/English content, Japanese search applications
