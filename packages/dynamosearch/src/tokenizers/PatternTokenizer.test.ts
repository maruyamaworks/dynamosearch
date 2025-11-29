import { test, expect } from 'vitest';
import PatternTokenizer from './PatternTokenizer.js';

test('PatternTokenizer', async () => {
  const tokenizer = new PatternTokenizer();
  const tokens = await tokenizer.tokenize('The foo_bar_size\'s default is 5.');
  expect(tokens).toMatchObject([
    { token: 'The', startOffset: 0, endOffset: 3, position: 0 },
    { token: 'foo_bar_size', startOffset: 4, endOffset: 16, position: 1 },
    { token: 's', startOffset: 17, endOffset: 18, position: 2 },
    { token: 'default', startOffset: 19, endOffset: 26, position: 3 },
    { token: 'is', startOffset: 27, endOffset: 29, position: 4 },
    { token: '5', startOffset: 30, endOffset: 31, position: 5 },
  ]);
});

test('PatternTokenizer', async () => {
  const tokenizer = new PatternTokenizer({ pattern: /,/g });
  const tokens = await tokenizer.tokenize('comma,separated,values');
  expect(tokens).toMatchObject([
    { token: 'comma', startOffset: 0, endOffset: 5, position: 0 },
    { token: 'separated', startOffset: 6, endOffset: 15, position: 1 },
    { token: 'values', startOffset: 16, endOffset: 22, position: 2 },
  ]);
});

test('PatternTokenizer', async () => {
  const tokenizer = new PatternTokenizer({ pattern: /"((?:\\"|[^"]|\\")*)"/g, group: 1 });
  const tokens = await tokenizer.tokenize('"value", "value with embedded \\" quote"');
  expect(tokens).toMatchObject([
    { token: 'value', startOffset: 1, endOffset: 6, position: 0 },
    { token: 'value with embedded \\" quote', startOffset: 10, endOffset: 38, position: 1 },
  ]);
});
