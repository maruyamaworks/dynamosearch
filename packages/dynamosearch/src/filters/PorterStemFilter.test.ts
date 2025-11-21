import { test, expect } from 'vitest';
import PorterStemFilter from './PorterStemFilter.js';

test('PorterStemFilter', () => {
  const filter = PorterStemFilter();
  const input = [
    { text: 'the' },
    { text: 'foxes' },
    { text: 'jumping' },
    { text: 'quickly' },
  ];
  expect(filter(input)).toEqual([
    { text: 'the' },
    { text: 'fox' },
    { text: 'jump' },
    { text: 'quickli' },
  ]);
});
