import { test, expect } from 'vitest';
import EnglishPossessiveFilter from './EnglishPossessiveFilter.js';

test('EnglishPossessiveFilter', () => {
  const filter = new EnglishPossessiveFilter();
  const input = [
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'lazy', startOffset: 4, endOffset: 8, position: 1 },
    { token: 'dog\'s', startOffset: 9, endOffset: 14, position: 2 },
    { token: 'bone', startOffset: 15, endOffset: 19, position: 3 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'lazy', startOffset: 4, endOffset: 8, position: 1 },
    { token: 'dog', startOffset: 9, endOffset: 14, position: 2 },
    { token: 'bone', startOffset: 15, endOffset: 19, position: 3 },
  ]);
});
