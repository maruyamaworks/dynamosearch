import { test, expect } from 'vitest';
import URLEmailTokenizer from './URLEmailTokenizer.js';

test('URLEmailTokenizer', async () => {
  const tokenizer = await URLEmailTokenizer.getInstance();
  const tokens = tokenizer.tokenize('Contact us at support@example.com or visit https://example.com for details.');
  expect(tokens).toMatchObject([
    { text: 'Contact' },
    { text: 'us' },
    { text: 'at' },
    { text: 'support@example.com' },
    { text: 'or' },
    { text: 'visit' },
    { text: 'https://example.com' },
    { text: 'for' },
    { text: 'details' },
  ]);
});
