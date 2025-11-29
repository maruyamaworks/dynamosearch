import { test, expect } from 'vitest';
import ShingleFilter from './ShingleFilter.js';

test('ShingleFilter', () => {
  const filter = new ShingleFilter();
  const input = [
    { token: 'quick', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'brown', startOffset: 6, endOffset: 11, position: 1 },
    { token: 'fox', startOffset: 12, endOffset: 15, position: 2 },
    { token: 'jumps', startOffset: 16, endOffset: 21, position: 3 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'quick', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'quick brown', startOffset: 0, endOffset: 11, position: 0 },
    { token: 'brown', startOffset: 6, endOffset: 11, position: 1 },
    { token: 'brown fox', startOffset: 6, endOffset: 15, position: 1 },
    { token: 'fox', startOffset: 12, endOffset: 15, position: 2 },
    { token: 'fox jumps', startOffset: 12, endOffset: 21, position: 2 },
    { token: 'jumps', startOffset: 16, endOffset: 21, position: 3 },
  ]);
});
