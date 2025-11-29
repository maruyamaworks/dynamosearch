import { test, expect } from 'vitest';
import KeywordMarkerFilter from './KeywordMarkerFilter.js';

test('KeywordMarkerFilter', () => {
  const filter = new KeywordMarkerFilter({ keywords: ['jumping'] });
  const input = [
    { token: 'fox', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'running', startOffset: 4, endOffset: 11, position: 1 },
    { token: 'and', startOffset: 12, endOffset: 15, position: 2 },
    { token: 'jumping', startOffset: 16, endOffset: 23, position: 3 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'fox', startOffset: 0, endOffset: 3, position: 0, keyword: false },
    { token: 'running', startOffset: 4, endOffset: 11, position: 1, keyword: false },
    { token: 'and', startOffset: 12, endOffset: 15, position: 2, keyword: false },
    { token: 'jumping', startOffset: 16, endOffset: 23, position: 3, keyword: true },
  ]);
});
