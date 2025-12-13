import { test, expect } from 'vitest';
import JapaneseStopFilter from './JapaneseStopFilter.js';

test('JapaneseStopFilter', () => {
  const filter = new JapaneseStopFilter();
  const input = [
    { token: 'ストップ', startOffset: 0, endOffset: 4, position: 0 },
    { token: 'は', startOffset: 4, endOffset: 5, position: 1 },
    { token: '消える', startOffset: 5, endOffset: 8, position: 2 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'ストップ', startOffset: 0, endOffset: 4, position: 0 },
    { token: '消える', startOffset: 5, endOffset: 8, position: 2 },
  ]);
});

test('JapaneseStopFilter', () => {
  const filter = new JapaneseStopFilter({ stopWords: ['_japanese_', 'ストップ'] });
  const input = [
    { token: 'ストップ', startOffset: 0, endOffset: 4, position: 0 },
    { token: 'は', startOffset: 4, endOffset: 5, position: 1 },
    { token: '消える', startOffset: 5, endOffset: 8, position: 2 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: '消える', startOffset: 5, endOffset: 8, position: 2 },
  ]);
});
