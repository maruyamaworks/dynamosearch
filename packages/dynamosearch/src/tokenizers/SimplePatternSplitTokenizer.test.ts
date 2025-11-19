import { test, expect } from 'vitest';
import SimplePatternSplitTokenizer from './SimplePatternSplitTokenizer.js';

test('SimplePatternSplitTokenizer', async () => {
  const tokenizer = await SimplePatternSplitTokenizer.getInstance({ pattern: /_/ });
  const tokens = tokenizer.tokenize('an_underscored_phrase');
  expect(tokens).toMatchObject([
    { text: 'an' },
    { text: 'underscored' },
    { text: 'phrase' },
  ]);
});
