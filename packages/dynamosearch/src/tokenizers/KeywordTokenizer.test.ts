import { test, expect } from 'vitest';
import KeywordTokenizer from './KeywordTokenizer.js';

test('KeywordTokenizer', async () => {
  const tokenizer = await KeywordTokenizer.getInstance();
  const tokens = tokenizer.tokenize('New York');
  expect(tokens).toMatchObject([
    { text: 'New York' },
  ]);
});
