# Analyzers

## KuromojiAnalyzer

Japanese text analyzer using Kuromoji morphological analysis.

```typescript
import KuromojiAnalyzer from '@dynamosearch/plugin-analysis-kuromoji/analyzers/KuromojiAnalyzer.js';
```

### Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

### Pipeline

- **Tokenizer**: `KuromojiTokenizer`
- **Filters**: `LowerCaseFilter`, `CJKWidthFilter`

### Usage

```typescript
const analyzer = await KuromojiAnalyzer.getInstance();
const tokens = analyzer.analyze('東京タワーに行きました');
// [
//   { text: '東京' },
//   { text: 'タワー' },
//   { text: 'に' },
//   { text: '行き' },
//   { text: 'まし' },
//   { text: 'た' }
// ]
```

### Best For

- Japanese text
- Mixed Japanese/English content
- Japanese search applications
