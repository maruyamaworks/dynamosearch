import { test, expect } from 'vitest';
import WhitespaceTokenizer from './WhitespaceTokenizer.js';

test('WhitespaceTokenizer', async () => {
  const tokenizer = new WhitespaceTokenizer();
  const tokens = await tokenizer.tokenize('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { text: 'The' },
    { text: '2' },
    { text: 'QUICK' },
    { text: 'Brown-Foxes' },
    { text: 'jumped' },
    { text: 'over' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'dog\'s' },
    { text: 'bone.' },
  ]);
});
