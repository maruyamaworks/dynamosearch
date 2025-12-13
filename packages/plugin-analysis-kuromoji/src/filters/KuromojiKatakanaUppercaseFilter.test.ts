import { test, expect } from 'vitest';
import KuromojiKatakanaUppercaseFilter from './KuromojiKatakanaUppercaseFilter.js';

test('KuromojiKatakanaUppercaseFilter', () => {
  const filter = new KuromojiKatakanaUppercaseFilter();
  const input = [
    { token: 'ストップウォッチ', startOffset: 0, endOffset: 8, position: 0 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'ストツプウオツチ', startOffset: 0, endOffset: 8, position: 0 },
  ]);
});
