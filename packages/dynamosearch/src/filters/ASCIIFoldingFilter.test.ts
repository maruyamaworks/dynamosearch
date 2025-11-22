import { test, expect } from 'vitest';
import ASCIIFoldingFilter from './ASCIIFoldingFilter.js';

test('ASCIIFoldingFilter', () => {
  const filter = ASCIIFoldingFilter();
  const input = [
    { text: 'açaí' },
    { text: 'à' },
    { text: 'la' },
    { text: 'carte' },
  ];
  expect(filter(input)).toEqual([
    { text: 'acai' },
    { text: 'a' },
    { text: 'la' },
    { text: 'carte' },
  ]);
});
