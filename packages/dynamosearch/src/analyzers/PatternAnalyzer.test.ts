import { test, expect } from 'vitest';
import PatternAnalyzer from './PatternAnalyzer.js';

test('PatternAnalyzer', async () => {
  const analyzer = new PatternAnalyzer();
  const tokens = await analyzer.analyze('The 2 QUICK Brown-Foxes jumped over the lazy dog\'s bone.');
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
    { text: 'dog' },
    { text: 's' },
    { text: 'bone' },
  ]);
});

test('PatternAnalyzer', async () => {
  const analyzer = new PatternAnalyzer({ pattern: /\W|_/ });
  const tokens = await analyzer.analyze('John_Smith@foo-bar.com');
  expect(tokens).toMatchObject([
    { text: 'john' },
    { text: 'smith' },
    { text: 'foo' },
    { text: 'bar' },
    { text: 'com' },
  ]);
});
