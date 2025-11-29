import { test, expect } from 'vitest';
import TruncateFilter from './TruncateFilter.js';

test('TruncateFilter', () => {
  const filter = new TruncateFilter();
  const input = [
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'quinquennial', startOffset: 4, endOffset: 16, position: 1 },
    { token: 'extravaganza', startOffset: 17, endOffset: 29, position: 2 },
    { token: 'carried', startOffset: 30, endOffset: 37, position: 3 },
    { token: 'on', startOffset: 38, endOffset: 40, position: 4 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'quinquenni', startOffset: 4, endOffset: 16, position: 1 },
    { token: 'extravagan', startOffset: 17, endOffset: 29, position: 2 },
    { token: 'carried', startOffset: 30, endOffset: 37, position: 3 },
    { token: 'on', startOffset: 38, endOffset: 40, position: 4 },
  ]);
});
