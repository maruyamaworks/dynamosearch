import { test, expect } from 'vitest';
import CJKBigramFilter from './CJKBigramFilter.js';

test('CJKBigramFilter', () => {
  const filter = new CJKBigramFilter();
  const input = [
    { token: '東', startOffset: 0, endOffset: 1, position: 0 },
    { token: '京', startOffset: 1, endOffset: 2, position: 1 },
    { token: '都', startOffset: 2, endOffset: 3, position: 2 },
    { token: 'は', startOffset: 3, endOffset: 4, position: 3 },
    { token: '日', startOffset: 5, endOffset: 6, position: 4 },
    { token: '本', startOffset: 6, endOffset: 7, position: 5 },
    { token: 'の', startOffset: 7, endOffset: 8, position: 6 },
    { token: '首', startOffset: 8, endOffset: 9, position: 7 },
    { token: '都', startOffset: 9, endOffset: 10, position: 8 },
    { token: 'で', startOffset: 10, endOffset: 11, position: 9 },
    { token: 'あ', startOffset: 11, endOffset: 12, position: 10 },
    { token: 'り', startOffset: 12, endOffset: 13, position: 11 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: '東京', startOffset: 0, endOffset: 2, position: 0 },
    { token: '京都', startOffset: 1, endOffset: 3, position: 1 },
    { token: '都は', startOffset: 2, endOffset: 4, position: 2 },
    { token: '日本', startOffset: 5, endOffset: 7, position: 4 },
    { token: '本の', startOffset: 6, endOffset: 8, position: 5 },
    { token: 'の首', startOffset: 7, endOffset: 9, position: 6 },
    { token: '首都', startOffset: 8, endOffset: 10, position: 7 },
    { token: '都で', startOffset: 9, endOffset: 11, position: 8 },
    { token: 'であ', startOffset: 10, endOffset: 12, position: 9 },
    { token: 'あり', startOffset: 11, endOffset: 13, position: 10 },
  ]);
});
