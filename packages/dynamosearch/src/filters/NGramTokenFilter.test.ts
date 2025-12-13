import { test, expect } from 'vitest';
import NGramTokenFilter from './NGramTokenFilter.js';

test('NGramTokenFilter', () => {
  const filter = new NGramTokenFilter();
  const input = [
    { token: 'Quick', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'fox', startOffset: 6, endOffset: 9, position: 1 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'Q', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'Qu', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'u', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'ui', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'i', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'ic', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'c', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'ck', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'k', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'f', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'fo', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'o', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'ox', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'x', startOffset: 6, endOffset: 9, position: 1 },
  ]);
});

test('NGramTokenFilter', () => {
  const filter = new NGramTokenFilter({ preserveOriginal: true });
  const input = [
    { token: 'Quick', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'fox', startOffset: 6, endOffset: 9, position: 1 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'Q', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'Qu', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'u', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'ui', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'i', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'ic', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'c', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'ck', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'k', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'Quick', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'f', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'fo', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'o', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'ox', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'x', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'fox', startOffset: 6, endOffset: 9, position: 1 },
  ]);
});
