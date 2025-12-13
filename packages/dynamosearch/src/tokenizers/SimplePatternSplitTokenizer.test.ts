import { test, expect } from 'vitest';
import SimplePatternSplitTokenizer from './SimplePatternSplitTokenizer.js';

test('SimplePatternSplitTokenizer', async () => {
  const tokenizer = new SimplePatternSplitTokenizer({ pattern: /_/ });
  const tokens = await tokenizer.tokenize('an_underscored_phrase');
  expect(tokens).toMatchObject([
    { token: 'an', startOffset: 0, endOffset: 2, position: 0 },
    { token: 'underscored', startOffset: 3, endOffset: 14, position: 1 },
    { token: 'phrase', startOffset: 15, endOffset: 21, position: 2 },
  ]);
});

test('SimplePatternSplitTokenizer', async () => {
  const tokenizer = new SimplePatternSplitTokenizer({ pattern: /\s+/ });
  const tokens = await tokenizer.tokenize('an_underscored_phrase');
  expect(tokens).toMatchObject([
    { token: 'an_underscored_phrase', startOffset: 0, endOffset: 21, position: 0 },
  ]);
});
