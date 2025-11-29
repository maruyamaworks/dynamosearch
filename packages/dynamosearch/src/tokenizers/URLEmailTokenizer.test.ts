import { test, expect } from 'vitest';
import URLEmailTokenizer from './URLEmailTokenizer.js';

test('URLEmailTokenizer', async () => {
  const tokenizer = new URLEmailTokenizer();
  const tokens = await tokenizer.tokenize('Contact us at support@example.com or visit https://example.com for details.');
  expect(tokens).toMatchObject([
    { token: 'Contact', startOffset: 0, endOffset: 7, position: 0 },
    { token: 'us', startOffset: 8, endOffset: 10, position: 1 },
    { token: 'at', startOffset: 11, endOffset: 13, position: 2 },
    { token: 'support@example.com', startOffset: 14, endOffset: 33, position: 3 },
    { token: 'or', startOffset: 34, endOffset: 36, position: 4 },
    { token: 'visit', startOffset: 37, endOffset: 42, position: 5 },
    { token: 'https://example.com', startOffset: 43, endOffset: 62, position: 6 },
    { token: 'for', startOffset: 63, endOffset: 66, position: 7 },
    { token: 'details', startOffset: 67, endOffset: 74, position: 8 },
  ]);
});
