import { test, expect } from 'vitest';
import LowerCaseFilter from './LowerCaseFilter.js';

test('LowerCaseFilter', () => {
  const filter = new LowerCaseFilter();
  const input = [
    { token: 'THE', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'Quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'FoX', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'JUMPs', startOffset: 14, endOffset: 19, position: 3 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'fox', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'jumps', startOffset: 14, endOffset: 19, position: 3 },
  ]);
});
