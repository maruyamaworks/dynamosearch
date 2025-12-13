import { test, expect } from 'vitest';
import CJKWidthFilter from './CJKWidthFilter.js';

test('CJKWidthFilter', () => {
  const filter = new CJKWidthFilter();
  const input = [
    { token: 'ｼｰｻｲﾄﾞﾗｲﾅｰ', startOffset: 0, endOffset: 10, position: 0 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'シーサイドライナー', startOffset: 0, endOffset: 10, position: 0 },
  ]);
});

test('CJKWidthFilter', () => {
  const filter = new CJKWidthFilter();
  const input = [
    { token: 'ＡＢＣ１２３', startOffset: 0, endOffset: 10, position: 0 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'ABC123', startOffset: 0, endOffset: 10, position: 0 },
  ]);
});
