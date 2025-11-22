import { test, expect } from 'vitest';
import KuromojiTokenizer from './KuromojiTokenizer.js';

test('KuromojiTokenizer', async () => {
  const tokenizer = new KuromojiTokenizer({ discardPunctuation: true });
  const tokens = await tokenizer.tokenize('吾輩は猫である。名前はまだない。');
  expect(tokens).toMatchObject([
    { text: '吾輩' },
    { text: 'は' },
    { text: '猫' },
    { text: 'で' },
    { text: 'ある' },
    { text: '名前' },
    { text: 'は' },
    { text: 'まだ' },
    { text: 'ない' },
  ]);
});

test('KuromojiTokenizer', async () => {
  const tokenizer = new KuromojiTokenizer({ discardPunctuation: false });
  const tokens = await tokenizer.tokenize('吾輩は猫である。名前はまだない。');
  expect(tokens).toMatchObject([
    { text: '吾輩' },
    { text: 'は' },
    { text: '猫' },
    { text: 'で' },
    { text: 'ある' },
    { text: '。' },
    { text: '名前' },
    { text: 'は' },
    { text: 'まだ' },
    { text: 'ない' },
    { text: '。' },
  ]);
});

test('KuromojiTokenizer', async () => {
  const tokenizer = new KuromojiTokenizer({ discardPunctuation: true });
  const tokens = await tokenizer.tokenize('Hello, World!');
  expect(tokens).toMatchObject([
    { text: 'Hello' },
    { text: 'World' },
  ]);
});

test('KuromojiTokenizer', async () => {
  const tokenizer = new KuromojiTokenizer({ discardPunctuation: false });
  const tokens = await tokenizer.tokenize('Hello, World!');
  expect(tokens).toMatchObject([
    { text: 'Hello' },
    { text: ',' },
    { text: ' ' },
    { text: 'World' },
    { text: '!' },
  ]);
});
