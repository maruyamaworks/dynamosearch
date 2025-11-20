import { test, expect } from 'vitest';
import StopAnalyzer from './StopAnalyzer.js';

test('StopAnalyzer', async () => {
  const analyzer = await StopAnalyzer.getInstance();
  const tokens = analyzer.analyze('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
  expect(tokens).toMatchObject([
    { text: 'quick' },
    { text: 'brown' },
    { text: 'foxes' },
    { text: 'jumped' },
    { text: 'over' },
    { text: 'lazy' },
    { text: 'dog' },
    { text: 's' },
    { text: 'bone' },
  ]);
});
