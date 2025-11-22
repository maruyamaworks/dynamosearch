import { test, expect } from 'vitest';
import KeywordTokenizer from './KeywordTokenizer.js';

test('KeywordTokenizer', async () => {
  const tokenizer = new KeywordTokenizer();
  const tokens = await tokenizer.tokenize('New York');
  expect(tokens).toMatchObject([
    { text: 'New York' },
  ]);
});
