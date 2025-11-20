import { test, expect } from 'vitest';
import SimpleAnalyzer from './SimpleAnalyzer.js';

test('SimpleAnalyzer', async () => {
  const analyzer = await SimpleAnalyzer.getInstance();
  const tokens = analyzer.analyze('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { text: 'the' },
    { text: 'quick' },
    { text: 'brown' },
    { text: 'foxes' },
    { text: 'jumped' },
    { text: 'over' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'dog' },
    { text: 's' },
    { text: 'bone' },
  ]);
});
