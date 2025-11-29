import { test, expect } from 'vitest';
import ASCIIFoldingFilter from './ASCIIFoldingFilter.js';

test('ASCIIFoldingFilter', () => {
  const filter = new ASCIIFoldingFilter();
  const input = [
    { token: 'açaí', startOffset: 0, endOffset: 4, position: 0 },
    { token: 'à', startOffset: 5, endOffset: 6, position: 1 },
    { token: 'la', startOffset: 7, endOffset: 9, position: 2 },
    { token: 'carte', startOffset: 10, endOffset: 15, position: 3 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'acai', startOffset: 0, endOffset: 4, position: 0 },
    { token: 'a', startOffset: 5, endOffset: 6, position: 1 },
    { token: 'la', startOffset: 7, endOffset: 9, position: 2 },
    { token: 'carte', startOffset: 10, endOffset: 15, position: 3 },
  ]);
});
