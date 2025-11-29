import { test, expect } from 'vitest';
import UniqueFilter from './UniqueFilter.js';

test('UniqueFilter', () => {
  const filter = new UniqueFilter();
  const input = [
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'fox', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'jumps', startOffset: 14, endOffset: 19, position: 3 },
    { token: 'the', startOffset: 20, endOffset: 23, position: 4 },
    { token: 'lazy', startOffset: 24, endOffset: 28, position: 5 },
    { token: 'fox', startOffset: 29, endOffset: 32, position: 6 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'fox', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'jumps', startOffset: 14, endOffset: 19, position: 3 },
    { token: 'lazy', startOffset: 24, endOffset: 28, position: 5 },
  ]);
});
