import { test, expect } from 'vitest';
import StandardAnalyzer from './StandardAnalyzer.js';

test('StandardAnalyzer', async () => {
  const analyzer = await StandardAnalyzer.getInstance();
  const tokens = analyzer.analyze('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { text: 'the' },
    { text: '2' },
    { text: 'quick' },
    { text: 'brown' },
    { text: 'foxes' },
    { text: 'jumped' },
    { text: 'over' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'dog\'s' },
    { text: 'bone' },
  ]);
});
