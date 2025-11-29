import { test, expect } from 'vitest';
import ReverseStringFilter from './ReverseStringFilter.js';

test('ReverseStringFilter', () => {
  const filter = new ReverseStringFilter();
  const input = [
    { token: 'quick', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'fox', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'jumps', startOffset: 10, endOffset: 15, position: 2 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'kciuq', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'xof', startOffset: 6, endOffset: 9, position: 1 },
    { token: 'spmuj', startOffset: 10, endOffset: 15, position: 2 },
  ]);
});
