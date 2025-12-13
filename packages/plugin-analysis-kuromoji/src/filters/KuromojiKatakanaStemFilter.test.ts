import { test, expect } from 'vitest';
import KuromojiKatakanaStemFilter from './KuromojiKatakanaStemFilter.js';

test('KuromojiKatakanaStemFilter', () => {
  const filter = new KuromojiKatakanaStemFilter();
  const input = [
    { token: 'コピー', startOffset: 0, endOffset: 3, position: 0 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'コピー', startOffset: 0, endOffset: 3, position: 0 },
  ]);
});

test('KuromojiKatakanaStemFilter', () => {
  const filter = new KuromojiKatakanaStemFilter();
  const input = [
    { token: 'サーバー', startOffset: 0, endOffset: 4, position: 0 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'サーバ', startOffset: 0, endOffset: 4, position: 0 },
  ]);
});
