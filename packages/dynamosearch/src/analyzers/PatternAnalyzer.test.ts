import { test, expect } from 'vitest';
import PatternAnalyzer from './PatternAnalyzer.js';

test('PatternAnalyzer', async () => {
  const analyzer = new PatternAnalyzer();
  const tokens = await analyzer.analyze('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: '2', startOffset: 4, endOffset: 5, position: 1 },
    { token: 'quick', startOffset: 6, endOffset: 11, position: 2 },
    { token: 'brown', startOffset: 12, endOffset: 17, position: 3 },
    { token: 'foxes', startOffset: 18, endOffset: 23, position: 4 },
    { token: 'jumped', startOffset: 24, endOffset: 30, position: 5 },
    { token: 'over', startOffset: 31, endOffset: 35, position: 6 },
    { token: 'the', startOffset: 36, endOffset: 39, position: 7 },
    { token: 'lazy', startOffset: 40, endOffset: 44, position: 8 },
    { token: 'dog', startOffset: 45, endOffset: 48, position: 9 },
    { token: 's', startOffset: 49, endOffset: 50, position: 10 },
    { token: 'bone', startOffset: 51, endOffset: 55, position: 11 },
  ]);
});

test('PatternAnalyzer', async () => {
  const analyzer = new PatternAnalyzer({ pattern: /\W|_/ });
  const tokens = await analyzer.analyze('John_Smith@foo-bar.com');
  expect(tokens).toMatchObject([
    { token: 'john', startOffset: 0, endOffset: 4, position: 0 },
    { token: 'smith', startOffset: 5, endOffset: 10, position: 1 },
    { token: 'foo', startOffset: 11, endOffset: 14, position: 2 },
    { token: 'bar', startOffset: 15, endOffset: 18, position: 3 },
    { token: 'com', startOffset: 19, endOffset: 22, position: 4 },
  ]);
});
