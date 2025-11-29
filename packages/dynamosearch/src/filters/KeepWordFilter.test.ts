import { test, expect } from 'vitest';
import KeepWordFilter from './KeepWordFilter.js';

test('KeepWordFilter', () => {
  const filter = new KeepWordFilter({ keepWords: ['dog', 'elephant', 'fox'] });
  const input = [
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'fox', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'jumps', startOffset: 14, endOffset: 19, position: 3 },
    { token: 'over', startOffset: 20, endOffset: 24, position: 4 },
    { token: 'the', startOffset: 25, endOffset: 28, position: 5 },
    { token: 'lazy', startOffset: 29, endOffset: 33, position: 6 },
    { token: 'dog', startOffset: 34, endOffset: 37, position: 7 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'fox', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'dog', startOffset: 34, endOffset: 37, position: 7 },
  ]);
});
