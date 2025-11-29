import { test, expect } from 'vitest';
import LimitTokenCountFilter from './LimitTokenCountFilter.js';

test('LimitTokenCountFilter', () => {
  const filter = new LimitTokenCountFilter({ maxTokenCount: 2 });
  const input = [
    { token: 'quick', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'fox', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'jumps', startOffset: 10, endOffset: 15, position: 2 },
    { token: 'over', startOffset: 16, endOffset: 20, position: 3 },
    { token: 'lazy', startOffset: 21, endOffset: 25, position: 4 },
    { token: 'dog', startOffset: 26, endOffset: 29, position: 5 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'quick', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'fox', startOffset: 6, endOffset: 9, position: 1 },
  ]);
});
