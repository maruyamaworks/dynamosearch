import { test, expect } from 'vitest';
import KuromojiAnalyzer from './KuromojiAnalyzer.js';

test('KuromojiAnalyzer', async () => {
  const analyzer = new KuromojiAnalyzer();
  const tokens = await analyzer.analyze('吾輩は猫である。名前はまだない。');
  expect(tokens).toMatchObject([
    { token: '吾輩', startOffset: 0, endOffset: 2, position: 0 },
    { token: '猫', startOffset: 3, endOffset: 4, position: 2 },
    { token: '名前', startOffset: 8, endOffset: 10, position: 5 },
    { token: 'まだ', startOffset: 11, endOffset: 13, position: 7 },
  ]);
});
