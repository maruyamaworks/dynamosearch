import { test, expect } from 'vitest';
import ApostropheFilter from './ApostropheFilter.js';

test('ApostropheFilter', () => {
  const filter = new ApostropheFilter();
  const input = [
    { token: 'Istanbul\'a', startOffset: 0, endOffset: 10, position: 0 },
    { token: 'veya', startOffset: 11, endOffset: 15, position: 1 },
    { token: 'Istanbul\'dan', startOffset: 16, endOffset: 28, position: 2 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'Istanbul', startOffset: 0, endOffset: 10, position: 0 },
    { token: 'veya', startOffset: 11, endOffset: 15, position: 1 },
    { token: 'Istanbul', startOffset: 16, endOffset: 28, position: 2 },
  ]);
});
