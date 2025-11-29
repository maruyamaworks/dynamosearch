import { test, expect } from 'vitest';
import KeywordAnalyzer from './KeywordAnalyzer.js';

test('KeywordAnalyzer', async () => {
  const analyzer = new KeywordAnalyzer();
  const tokens = await analyzer.analyze('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { token: 'The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.', startOffset: 0, endOffset: 56, position: 0 },
  ]);
});
