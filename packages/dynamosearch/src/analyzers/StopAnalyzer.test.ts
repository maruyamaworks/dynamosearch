import { test, expect } from 'vitest';
import StopAnalyzer from './StopAnalyzer.js';

test('StopAnalyzer', async () => {
  const analyzer = new StopAnalyzer();
  const tokens = await analyzer.analyze('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { token: 'quick', startOffset: 6, endOffset: 11, position: 1 },
    { token: 'brown', startOffset: 12, endOffset: 17, position: 2 },
    { token: 'foxes', startOffset: 18, endOffset: 23, position: 3 },
    { token: 'jumped', startOffset: 24, endOffset: 30, position: 4 },
    { token: 'over', startOffset: 31, endOffset: 35, position: 5 },
    { token: 'lazy', startOffset: 40, endOffset: 44, position: 7 },
    { token: 'dog', startOffset: 45, endOffset: 48, position: 8 },
    { token: 's', startOffset: 49, endOffset: 50, position: 9 },
    { token: 'bone', startOffset: 51, endOffset: 55, position: 10 },
  ]);
});
