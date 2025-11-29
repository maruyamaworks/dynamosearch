import { test, expect } from 'vitest';
import ConditionalTokenFilter from './ConditionalTokenFilter.js';
import LowerCaseFilter from './LowerCaseFilter.js';

test('ConditionalTokenFilter', () => {
  const filter = new ConditionalTokenFilter({
    filters: [new LowerCaseFilter()],
    script: (token) => token.token.length < 5,
  });
  const input = [
    { token: 'THE', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'QUICK', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'BROWN', startOffset: 10, endOffset: 15, position: 2 },
    { token: 'FOX', startOffset: 16, endOffset: 19, position: 3 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'QUICK', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'BROWN', startOffset: 10, endOffset: 15, position: 2 },
    { token: 'fox', startOffset: 16, endOffset: 19, position: 3 },
  ]);
});
