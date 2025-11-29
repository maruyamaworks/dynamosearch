import { test, expect } from 'vitest';
import LetterTokenizer from './LetterTokenizer.js';

test('LetterTokenizer', async () => {
  const tokenizer = new LetterTokenizer();
  const tokens = await tokenizer.tokenize('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { token: 'The', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'QUICK', startOffset: 6, endOffset: 11, position: 1 },
    { token: 'Brown', startOffset: 12, endOffset: 17, position: 2 },
    { token: 'Foxes', startOffset: 18, endOffset: 23, position: 3 },
    { token: 'jumped', startOffset: 24, endOffset: 30, position: 4 },
    { token: 'over', startOffset: 31, endOffset: 35, position: 5 },
    { token: 'the', startOffset: 36, endOffset: 39, position: 6 },
    { token: 'lazy', startOffset: 40, endOffset: 44, position: 7 },
    { token: 'dog', startOffset: 45, endOffset: 48, position: 8 },
    { token: 's', startOffset: 49, endOffset: 50, position: 9 },
    { token: 'bone', startOffset: 51, endOffset: 55, position: 10 },
  ]);
});
