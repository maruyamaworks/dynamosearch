import { test, expect } from 'vitest';
import ASCIIFoldingFilter from './ASCIIFoldingFilter.js';

test('ASCIIFoldingFilter', () => {
  const filter = new ASCIIFoldingFilter();
  const input = [
    { text: 'açaí' },
    { text: 'à' },
    { text: 'la' },
    { text: 'carte' },
  ];
  expect(filter.apply(input)).toEqual([
    { text: 'acai' },
    { text: 'a' },
    { text: 'la' },
    { text: 'carte' },
  ]);
});
