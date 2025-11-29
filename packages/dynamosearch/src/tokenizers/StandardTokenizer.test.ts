import { test, expect } from 'vitest';
import StandardTokenizer from './StandardTokenizer.js';

test('StandardTokenizer', async () => {
  const tokenizer = new StandardTokenizer();
  const tokens = await tokenizer.tokenize('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { token: 'The', startOffset: 0, endOffset: 3, position: 0 },
    { token: '2', startOffset: 4, endOffset: 5, position: 1 },
    { token: 'QUICK', startOffset: 6, endOffset: 11, position: 2 },
    { token: 'Brown', startOffset: 12, endOffset: 17, position: 3 },
    { token: 'Foxes', startOffset: 18, endOffset: 23, position: 4 },
    { token: 'jumped', startOffset: 24, endOffset: 30, position: 5 },
    { token: 'over', startOffset: 31, endOffset: 35, position: 6 },
    { token: 'the', startOffset: 36, endOffset: 39, position: 7 },
    { token: 'lazy', startOffset: 40, endOffset: 44, position: 8 },
    { token: 'dog\'s', startOffset: 45, endOffset: 50, position: 9 },
    { token: 'bone', startOffset: 51, endOffset: 55, position: 10 },
  ]);
});
