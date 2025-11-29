import { test, expect } from 'vitest';
import CommonGramsFilter from './CommonGramsFilter.js';

test('CommonGramsFilter', () => {
  const filter = new CommonGramsFilter({ commonWords: ['is', 'the'] });
  const input = [
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'fox', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'is', startOffset: 14, endOffset: 16, position: 3 },
    { token: 'brown', startOffset: 17, endOffset: 22, position: 4 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'the_quick', startOffset: 0, endOffset: 9, position: 0 },
    { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'fox', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'fox_is', startOffset: 10, endOffset: 16, position: 2 },
    { token: 'is', startOffset: 14, endOffset: 16, position: 3 },
    { token: 'is_brown', startOffset: 14, endOffset: 22, position: 3 },
    { token: 'brown', startOffset: 17, endOffset: 22, position: 4 },
  ]);
});

test('CommonGramsFilter', () => {
  const filter = new CommonGramsFilter({ commonWords: ['is', 'the'], queryMode: true });
  const input = [
    { token: 'the', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'fox', startOffset: 10, endOffset: 13, position: 2 },
    { token: 'is', startOffset: 14, endOffset: 16, position: 3 },
    { token: 'brown', startOffset: 17, endOffset: 22, position: 4 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'the_quick', startOffset: 0, endOffset: 9, position: 0 },
    { token: 'quick', startOffset: 4, endOffset: 9, position: 1 },
    { token: 'fox_is', startOffset: 10, endOffset: 16, position: 2 },
    { token: 'is_brown', startOffset: 14, endOffset: 22, position: 3 },
  ]);
});
