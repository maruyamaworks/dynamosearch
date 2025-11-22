import { test, expect } from 'vitest';
import LetterTokenizer from './LetterTokenizer.js';

test('LetterTokenizer', async () => {
  const tokenizer = new LetterTokenizer();
  const tokens = await tokenizer.tokenize('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { text: 'The' },
    { text: 'QUICK' },
    { text: 'Brown' },
    { text: 'Foxes' },
    { text: 'jumped' },
    { text: 'over' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'dog' },
    { text: 's' },
    { text: 'bone' },
  ]);
});
