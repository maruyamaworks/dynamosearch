import { test, expect } from 'vitest';
import StopFilter from './StopFilter.js';

test('StopFilter', () => {
  const filter = new StopFilter();
  const input = [
    { token: 'a', startOffset: 0, endOffset: 1, position: 0 },
    { token: 'quick', startOffset: 2, endOffset: 7, position: 1 },
    { token: 'fox', startOffset: 8, endOffset: 11, position: 2 },
    { token: 'jumps', startOffset: 12, endOffset: 17, position: 3 },
    { token: 'over', startOffset: 18, endOffset: 22, position: 4 },
    { token: 'the', startOffset: 23, endOffset: 26, position: 5 },
    { token: 'lazy', startOffset: 27, endOffset: 31, position: 6 },
    { token: 'dog', startOffset: 32, endOffset: 35, position: 7 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'quick', startOffset: 2, endOffset: 7, position: 1 },
    { token: 'fox', startOffset: 8, endOffset: 11, position: 2 },
    { token: 'jumps', startOffset: 12, endOffset: 17, position: 3 },
    { token: 'over', startOffset: 18, endOffset: 22, position: 4 },
    { token: 'lazy', startOffset: 27, endOffset: 31, position: 6 },
    { token: 'dog', startOffset: 32, endOffset: 35, position: 7 },
  ]);
});

test('StopFilter', () => {
  const filter = new StopFilter({ stopWords: ['_english_', 'over'] });
  const input = [
    { token: 'a', startOffset: 0, endOffset: 1, position: 0 },
    { token: 'quick', startOffset: 2, endOffset: 7, position: 1 },
    { token: 'fox', startOffset: 8, endOffset: 11, position: 2 },
    { token: 'jumps', startOffset: 12, endOffset: 17, position: 3 },
    { token: 'over', startOffset: 18, endOffset: 22, position: 4 },
    { token: 'the', startOffset: 23, endOffset: 26, position: 5 },
    { token: 'lazy', startOffset: 27, endOffset: 31, position: 6 },
    { token: 'dog', startOffset: 32, endOffset: 35, position: 7 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'quick', startOffset: 2, endOffset: 7, position: 1 },
    { token: 'fox', startOffset: 8, endOffset: 11, position: 2 },
    { token: 'jumps', startOffset: 12, endOffset: 17, position: 3 },
    { token: 'lazy', startOffset: 27, endOffset: 31, position: 6 },
    { token: 'dog', startOffset: 32, endOffset: 35, position: 7 },
  ]);
});
