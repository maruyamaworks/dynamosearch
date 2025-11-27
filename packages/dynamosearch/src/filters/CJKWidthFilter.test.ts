import { test, expect } from 'vitest';
import CJKWidthFilter from './CJKWidthFilter.js';

test('CJKWidthFilter', () => {
  const filter = new CJKWidthFilter();
  const input = [
    { text: 'ｼｰｻｲﾄﾞﾗｲﾅｰ' },
  ];
  expect(filter.apply(input)).toEqual([
    { text: 'シーサイドライナー' },
  ]);
});
