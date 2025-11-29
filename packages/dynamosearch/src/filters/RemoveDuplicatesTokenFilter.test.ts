import { test, expect } from 'vitest';
import RemoveDuplicatesTokenFilter from './RemoveDuplicatesTokenFilter.js';

test('RemoveDuplicatesTokenFilter', () => {
  const filter = new RemoveDuplicatesTokenFilter();
  const input = [
    { token: 'jumping', startOffset: 0, endOffset: 7, position: 0 },
    { token: 'jump', startOffset: 0, endOffset: 7, position: 0 },
    { token: 'dog', startOffset: 8, endOffset: 11, position: 1 },
    { token: 'dog', startOffset: 8, endOffset: 11, position: 1 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'jumping', startOffset: 0, endOffset: 7, position: 0 },
    { token: 'jump', startOffset: 0, endOffset: 7, position: 0 },
    { token: 'dog', startOffset: 8, endOffset: 11, position: 1 },
  ]);
});
