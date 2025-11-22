import { test, expect } from 'vitest';
import WhitespaceAnalyzer from './WhitespaceAnalyzer.js';

test('WhitespaceAnalyzer', async () => {
  const analyzer = new WhitespaceAnalyzer();
  const tokens = await analyzer.analyze('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { text: 'The' },
    { text: '2' },
    { text: 'QUICK' },
    { text: 'Brown-Foxes' },
    { text: 'jumped' },
    { text: 'over' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'dog\'s' },
    { text: 'bone.' },
  ]);
});
