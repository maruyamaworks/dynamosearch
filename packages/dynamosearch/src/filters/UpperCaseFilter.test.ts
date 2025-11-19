import { test, expect } from 'vitest';
import UpperCaseFilter from './UpperCaseFilter.js';

test('UpperCaseFilter', () => {
  const filter = UpperCaseFilter();
  const input = [
    { text: 'the' },
    { text: 'Quick' },
    { text: 'FoX' },
    { text: 'JUMPs' },
  ];
  expect(filter(input)).toEqual([
    { text: 'THE' },
    { text: 'QUICK' },
    { text: 'FOX' },
    { text: 'JUMPS' },
  ]);
});
