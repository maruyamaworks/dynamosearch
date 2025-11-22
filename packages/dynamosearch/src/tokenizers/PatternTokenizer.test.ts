import { test, expect } from 'vitest';
import PatternTokenizer from './PatternTokenizer.js';

test('PatternTokenizer', async () => {
  const tokenizer = await PatternTokenizer.getInstance();
  const tokens = tokenizer.tokenize('The foo_bar_size\'s default is 5.');
  expect(tokens).toMatchObject([
    { text: 'The' },
    { text: 'foo_bar_size' },
    { text: 's' },
    { text: 'default' },
    { text: 'is' },
    { text: '5' },
  ]);
});

test('PatternTokenizer', async () => {
  const tokenizer = await PatternTokenizer.getInstance({ pattern: /,/g });
  const tokens = tokenizer.tokenize('comma,separated,values');
  expect(tokens).toMatchObject([
    { text: 'comma' },
    { text: 'separated' },
    { text: 'values' },
  ]);
});

test('PatternTokenizer', async () => {
  const tokenizer = await PatternTokenizer.getInstance({ pattern: /"((?:\\"|[^"]|\\")*)"/g, group: 1 });
  const tokens = tokenizer.tokenize('"value", "value with embedded \\" quote"');
  expect(tokens).toMatchObject([
    { text: 'value' },
    { text: 'value with embedded \\" quote' },
  ]);
});
