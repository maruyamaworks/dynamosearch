import { test, expect } from 'vitest';
import KeywordAnalyzer from './KeywordAnalyzer.js';

test('KeywordAnalyzer', async () => {
  const analyzer = await KeywordAnalyzer.getInstance();
  const tokens = analyzer.analyze('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { text: 'The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.' },
  ]);
});
