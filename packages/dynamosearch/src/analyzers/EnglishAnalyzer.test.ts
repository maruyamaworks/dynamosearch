import { test, expect } from 'vitest';
import EnglishAnalyzer from './EnglishAnalyzer.js';

test('EnglishAnalyzer', async () => {
  const analyzer = new EnglishAnalyzer();
  const tokens = await analyzer.analyze('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { token: '2', startOffset: 4, endOffset: 5, position: 1 },
    { token: 'quick', startOffset: 6, endOffset: 11, position: 2 },
    { token: 'brown', startOffset: 12, endOffset: 17, position: 3 },
    { token: 'fox', startOffset: 18, endOffset: 23, position: 4 },
    { token: 'jump', startOffset: 24, endOffset: 30, position: 5 },
    { token: 'over', startOffset: 31, endOffset: 35, position: 6 },
    { token: 'lazi', startOffset: 40, endOffset: 44, position: 8 },
    { token: 'dog', startOffset: 45, endOffset: 50, position: 9 },
    { token: 'bone', startOffset: 51, endOffset: 55, position: 10 },
  ]);
});
