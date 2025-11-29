import { test, expect } from 'vitest';
import PorterStemFilter from './PorterStemFilter.js';

test('PorterStemFilter', () => {
  const filter = new PorterStemFilter();
  const input = [
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'foxes', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'jumping', startOffset: 10, endOffset: 17, position: 2 },
    { token: 'quickly', startOffset: 18, endOffset: 25, position: 3 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'fox', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'jump', startOffset: 10, endOffset: 17, position: 2 },
    { token: 'quickli', startOffset: 18, endOffset: 25, position: 3 },
  ]);
});
