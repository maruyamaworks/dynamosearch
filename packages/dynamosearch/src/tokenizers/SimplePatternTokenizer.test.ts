import { test, expect } from 'vitest';
import SimplePatternTokenizer from './SimplePatternTokenizer.js';

test('SimplePatternTokenizer', async () => {
  const tokenizer = await SimplePatternTokenizer.getInstance({ pattern: /[0-9]{3}/g });
  const tokens = tokenizer.tokenize('fd-786-335-514-x');
  expect(tokens).toMatchObject([
    { text: '786' },
    { text: '335' },
    { text: '514' },
  ]);
});
