import { test, expect } from 'vitest';
import TrimFilter from './TrimFilter.js';

test('TrimFilter', () => {
  const filter = new TrimFilter();
  const input = [
    { token: ' fox ', startOffset: 0, endOffset: 5, position: 0 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'fox', startOffset: 0, endOffset: 5, position: 0 },
  ]);
});
