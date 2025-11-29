import { test, expect } from 'vitest';
import SimplePatternTokenizer from './SimplePatternTokenizer.js';

test('SimplePatternTokenizer', async () => {
  const tokenizer = new SimplePatternTokenizer({ pattern: /[0-9]{3}/g });
  const tokens = await tokenizer.tokenize('fd-786-335-514-x');
  expect(tokens).toMatchObject([
    { token: '786', startOffset: 3, endOffset: 6, position: 0 },
    { token: '335', startOffset: 7, endOffset: 10, position: 1 },
    { token: '514', startOffset: 11, endOffset: 14, position: 2 },
  ]);
});
