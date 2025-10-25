import { test, expect } from 'vitest';
import NGramTokenizer from './NGramTokenizer.js';

test('NGramTokenizer', async () => {
  const tokenizer = await NGramTokenizer.getInstance({ minGram: 1, maxGram: 2 });
  const tokens = tokenizer.tokenize('Quick Fox');
  expect(tokens).toMatchObject([
    { text: 'Q' },
    { text: 'Qu' },
    { text: 'u' },
    { text: 'ui' },
    { text: 'i' },
    { text: 'ic' },
    { text: 'c' },
    { text: 'ck' },
    { text: 'k' },
    { text: 'k ' },
    { text: ' ' },
    { text: ' F' },
    { text: 'F' },
    { text: 'Fo' },
    { text: 'o' },
    { text: 'ox' },
    { text: 'x' },
  ]);
});
