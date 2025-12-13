import { test, expect } from 'vitest';
import KuromojiHiraganaUppercaseFilter from './KuromojiHiraganaUppercaseFilter.js';

test('KuromojiHiraganaUppercaseFilter', () => {
  const filter = new KuromojiHiraganaUppercaseFilter();
  const input = [
    { token: 'ちょっと', startOffset: 0, endOffset: 4, position: 0 },
    { token: 'まっ', startOffset: 4, endOffset: 6, position: 1 },
    { token: 'て', startOffset: 6, endOffset: 7, position: 2 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'ちよつと', startOffset: 0, endOffset: 4, position: 0 },
    { token: 'まつ', startOffset: 4, endOffset: 6, position: 1 },
    { token: 'て', startOffset: 6, endOffset: 7, position: 2 },
  ]);
});
