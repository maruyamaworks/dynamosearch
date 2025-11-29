import { test, expect } from 'vitest';
import NGramTokenizer from './NGramTokenizer.js';

test('NGramTokenizer', async () => {
  const tokenizer = new NGramTokenizer({ minGram: 1, maxGram: 2 });
  const tokens = await tokenizer.tokenize('Quick Fox');
  expect(tokens).toMatchObject([
    { token: 'Q', startOffset: 0, endOffset: 1, position: 0 },
    { token: 'Qu', startOffset: 0, endOffset: 2, position: 1 },
    { token: 'u', startOffset: 1, endOffset: 2, position: 2 },
    { token: 'ui', startOffset: 1, endOffset: 3, position: 3 },
    { token: 'i', startOffset: 2, endOffset: 3, position: 4 },
    { token: 'ic', startOffset: 2, endOffset: 4, position: 5 },
    { token: 'c', startOffset: 3, endOffset: 4, position: 6 },
    { token: 'ck', startOffset: 3, endOffset: 5, position: 7 },
    { token: 'k', startOffset: 4, endOffset: 5, position: 8 },
    { token: 'k ', startOffset: 4, endOffset: 6, position: 9 },
    { token: ' ', startOffset: 5, endOffset: 6, position: 10 },
    { token: ' F', startOffset: 5, endOffset: 7, position: 11 },
    { token: 'F', startOffset: 6, endOffset: 7, position: 12 },
    { token: 'Fo', startOffset: 6, endOffset: 8, position: 13 },
    { token: 'o', startOffset: 7, endOffset: 8, position: 14 },
    { token: 'ox', startOffset: 7, endOffset: 9, position: 15 },
    { token: 'x', startOffset: 8, endOffset: 9, position: 16 },
  ]);
});
