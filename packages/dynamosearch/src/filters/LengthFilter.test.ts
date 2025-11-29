import { test, expect } from 'vitest';
import LengthFilter from './LengthFilter.js';

test('LengthFilter', () => {
  const filter = new LengthFilter({ min: 0, max: 4 });
  const input = [
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'brown', startOffset: 10, endOffset: 15, position: 2 },
    { token: 'fox', startOffset: 16, endOffset: 19, position: 3 },
    { token: 'jumps', startOffset: 20, endOffset: 25, position: 4 },
    { token: 'over', startOffset: 26, endOffset: 30, position: 5 },
    { token: 'the', startOffset: 31, endOffset: 34, position: 6 },
    { token: 'lazy', startOffset: 35, endOffset: 39, position: 7 },
    { token: 'dog', startOffset: 40, endOffset: 43, position: 8 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'fox', startOffset: 16, endOffset: 19, position: 3 },
    { token: 'over', startOffset: 26, endOffset: 30, position: 5 },
    { token: 'the', startOffset: 31, endOffset: 34, position: 6 },
    { token: 'lazy', startOffset: 35, endOffset: 39, position: 7 },
    { token: 'dog', startOffset: 40, endOffset: 43, position: 8 },
  ]);
});
