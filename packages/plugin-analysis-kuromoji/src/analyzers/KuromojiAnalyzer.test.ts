import { test, expect } from 'vitest';
import KuromojiAnalyzer from './KuromojiAnalyzer.js';

test('KuromojiAnalyzer', async () => {
  const analyzer = await KuromojiAnalyzer.getInstance();
  const tokens = analyzer.analyze('吾輩は猫である。名前はまだない。');
  expect(tokens).toMatchObject([
    { text: '吾輩' },
    { text: '猫' },
    { text: '名前' },
    { text: 'まだ' },
  ]);
});
