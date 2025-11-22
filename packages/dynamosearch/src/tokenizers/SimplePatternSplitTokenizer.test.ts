import { test, expect } from 'vitest';
import SimplePatternSplitTokenizer from './SimplePatternSplitTokenizer.js';

test('SimplePatternSplitTokenizer', async () => {
  const tokenizer = new SimplePatternSplitTokenizer({ pattern: /_/ });
  const tokens = await tokenizer.tokenize('an_underscored_phrase');
  expect(tokens).toMatchObject([
    { text: 'an' },
    { text: 'underscored' },
    { text: 'phrase' },
  ]);
});
