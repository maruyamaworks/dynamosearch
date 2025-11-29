import { test, expect } from 'vitest';
import UpperCaseFilter from './UpperCaseFilter.js';

test('UpperCaseFilter', () => {
  const filter = new UpperCaseFilter();
  const input = [
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'Quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'FoX', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'JUMPs', startOffset: 14, endOffset: 19, position: 3 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'THE', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'QUICK', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'FOX', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'JUMPS', startOffset: 14, endOffset: 19, position: 3 },
  ]);
});
