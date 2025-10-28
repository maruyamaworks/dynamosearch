import { test, expect } from 'vitest';
import CJKWidthFilter from './CJKWidthFilter.js';

test('CJKWidthFilter', () => {
  const filter = CJKWidthFilter();
  const input = [
    { text: 'ｼｰｻｲﾄﾞﾗｲﾅｰ' },
  ];
  expect(filter(input)).toEqual([
    { text: 'シーサイドライナー' },
  ]);
});
