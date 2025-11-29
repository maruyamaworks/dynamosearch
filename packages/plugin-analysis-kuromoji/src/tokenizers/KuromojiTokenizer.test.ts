import { test, expect } from 'vitest';
import KuromojiTokenizer from './KuromojiTokenizer.js';

test('KuromojiTokenizer', async () => {
  const tokenizer = new KuromojiTokenizer({ discardPunctuation: true });
  const tokens = await tokenizer.tokenize('吾輩は猫である。名前はまだない。');
  expect(tokens).toMatchObject([
    { token: '吾輩', startOffset: 0, endOffset: 2, position: 0 },
    { token: 'は', startOffset: 2, endOffset: 3, position: 1 },
    { token: '猫', startOffset: 3, endOffset: 4, position: 2 },
    { token: 'で', startOffset: 4, endOffset: 5, position: 3 },
    { token: 'ある', startOffset: 5, endOffset: 7, position: 4 },
    { token: '名前', startOffset: 8, endOffset: 10, position: 5 },
    { token: 'は', startOffset: 10, endOffset: 11, position: 6 },
    { token: 'まだ', startOffset: 11, endOffset: 13, position: 7 },
    { token: 'ない', startOffset: 13, endOffset: 15, position: 8 },
  ]);
});

test('KuromojiTokenizer', async () => {
  const tokenizer = new KuromojiTokenizer({ discardPunctuation: false });
  const tokens = await tokenizer.tokenize('吾輩は猫である。名前はまだない。');
  expect(tokens).toMatchObject([
    { token: '吾輩', startOffset: 0, endOffset: 2, position: 0 },
    { token: 'は', startOffset: 2, endOffset: 3, position: 1 },
    { token: '猫', startOffset: 3, endOffset: 4, position: 2 },
    { token: 'で', startOffset: 4, endOffset: 5, position: 3 },
    { token: 'ある', startOffset: 5, endOffset: 7, position: 4 },
    { token: '。', startOffset: 7, endOffset: 8, position: 5 },
    { token: '名前', startOffset: 8, endOffset: 10, position: 6 },
    { token: 'は', startOffset: 10, endOffset: 11, position: 7 },
    { token: 'まだ', startOffset: 11, endOffset: 13, position: 8 },
    { token: 'ない', startOffset: 13, endOffset: 15, position: 9 },
    { token: '。', startOffset: 15, endOffset: 16, position: 10 },
  ]);
});

test('KuromojiTokenizer', async () => {
  const tokenizer = new KuromojiTokenizer({ discardPunctuation: true });
  const tokens = await tokenizer.tokenize('Hello, World!');
  expect(tokens).toMatchObject([
    { token: 'Hello', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'World', startOffset: 7, endOffset: 12, position: 1 },
  ]);
});

test('KuromojiTokenizer', async () => {
  const tokenizer = new KuromojiTokenizer({ discardPunctuation: false });
  const tokens = await tokenizer.tokenize('Hello, World!');
  expect(tokens).toMatchObject([
    { token: 'Hello', startOffset: 0, endOffset: 5, position: 0 },
    { token: ',', startOffset: 5, endOffset: 6, position: 1 },
    { token: ' ', startOffset: 6, endOffset: 7, position: 2 },
    { token: 'World', startOffset: 7, endOffset: 12, position: 3 },
    { token: '!', startOffset: 12, endOffset: 13, position: 4 },
  ]);
});
