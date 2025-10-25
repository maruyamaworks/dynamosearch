import { test, expect } from 'vitest';
import StandardTokenizer from './StandardTokenizer.js';

test('StandardTokenizer', async () => {
  const tokenizer = await StandardTokenizer.getInstance();
  const tokens = tokenizer.tokenize('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { text: 'The' },
    { text: '2' },
    { text: 'QUICK' },
    { text: 'Brown' },
    { text: 'Foxes' },
    { text: 'jumped' },
    { text: 'over' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'dog\'s' },
    { text: 'bone' },
  ]);
});
