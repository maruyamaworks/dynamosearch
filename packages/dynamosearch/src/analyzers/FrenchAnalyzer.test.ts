import { test, expect } from 'vitest';
import FrenchAnalyzer from './FrenchAnalyzer.js';

test('FrenchAnalyzer', async () => {
  const analyzer = new FrenchAnalyzer();
  const tokens = await analyzer.analyze('Le rapide renard brun saute par-dessus le chien paresseux.');
  expect(tokens).toMatchObject([
    { token: 'rapid', startOffset: 3, endOffset: 9, position: 1 },
    { token: 'renard', startOffset: 10, endOffset: 16, position: 2 },
    { token: 'brun', startOffset: 17, endOffset: 21, position: 3 },
    { token: 'saut', startOffset: 22, endOffset: 27, position: 4 },
    { token: 'dessus', startOffset: 32, endOffset: 38, position: 6 },
    { token: 'chien', startOffset: 42, endOffset: 47, position: 8 },
    { token: 'paress', startOffset: 48, endOffset: 57, position: 9 },
  ]);
});
