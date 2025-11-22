# Tokenizers

## KuromojiTokenizer

Japanese morphological analyzer using Kuromoji.

```typescript
import KuromojiTokenizer from '@dynamosearch/plugin-analysis-kuromoji/tokenizers/KuromojiTokenizer';
```

### Installation

```bash
npm install @dynamosearch/plugin-analysis-kuromoji
```

### Usage

```typescript
const tokenizer = new KuromojiTokenizer();
const tokens = tokenizer.tokenize('すもももももももものうち');
// [
//   { text: 'すもも' },
//   { text: 'も' },
//   { text: 'もも' },
//   { text: 'も' },
//   { text: 'もも' },
//   { text: 'の' },
//   { text: 'うち' }
// ]
```

### Best For

- Japanese text
- Proper word segmentation for Japanese
- Japanese search applications
