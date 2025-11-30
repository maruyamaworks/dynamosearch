import { test, expect } from 'vitest';
import SpanishAnalyzer from './SpanishAnalyzer.js';

test('SpanishAnalyzer', async () => {
  const analyzer = new SpanishAnalyzer();
  const tokens = await analyzer.analyze('El rápido zorro marrón salta sobre el perro perezoso.');
  expect(tokens).toMatchObject([
    { token: 'rap', startOffset: 3, endOffset: 9, position: 1 },
    { token: 'zorr', startOffset: 10, endOffset: 15, position: 2 },
    { token: 'marron', startOffset: 16, endOffset: 22, position: 3 },
    { token: 'salt', startOffset: 23, endOffset: 28, position: 4 },
    { token: 'perr', startOffset: 38, endOffset: 43, position: 7 },
    { token: 'perez', startOffset: 44, endOffset: 52, position: 8 },
  ]);
});
