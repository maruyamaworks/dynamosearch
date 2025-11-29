import { test, expect } from 'vitest';
import EdgeNGramTokenFilter from './EdgeNGramTokenFilter.js';

test('EdgeNGramTokenFilter', () => {
  const filter = new EdgeNGramTokenFilter();
  const input = [
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'brown', startOffset: 10, endOffset: 15, position: 2 },
    { token: 'fox', startOffset: 16, endOffset: 19, position: 3 },
    { token: 'jumps', startOffset: 20, endOffset: 25, position: 4 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 't', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'th', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'q', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'qu', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'b', startOffset: 10, endOffset: 15, position: 2 },
    { token: 'br', startOffset: 10, endOffset: 15, position: 2 },
    { token: 'f', startOffset: 16, endOffset: 19, position: 3 },
    { token: 'fo', startOffset: 16, endOffset: 19, position: 3 },
    { token: 'j', startOffset: 20, endOffset: 25, position: 4 },
    { token: 'ju', startOffset: 20, endOffset: 25, position: 4 },
  ]);
});
