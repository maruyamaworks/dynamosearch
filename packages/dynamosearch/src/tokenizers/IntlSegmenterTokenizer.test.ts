import { test, expect } from 'vitest';
import IntlSegmenterTokenizer from './IntlSegmenterTokenizer.js';

test('IntlSegmenterTokenizer', async () => {
  const tokenizer = await IntlSegmenterTokenizer.getInstance({ locales: 'en-US' });
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
