import { test, expect } from 'vitest';
import LowerCaseTokenizer from './LowerCaseTokenizer.js';

test('LowerCaseTokenizer', async () => {
  const tokenizer = await LowerCaseTokenizer.getInstance();
  const tokens = tokenizer.tokenize('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { text: 'the' },
    { text: 'quick' },
    { text: 'brown' },
    { text: 'foxes' },
    { text: 'jumped' },
    { text: 'over' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'dog' },
    { text: 's' },
    { text: 'bone' },
  ]);
});
