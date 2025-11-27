import { test, expect } from 'vitest';
import UpperCaseFilter from './UpperCaseFilter.js';

test('UpperCaseFilter', () => {
  const filter = new UpperCaseFilter();
  const input = [
    { text: 'the' },
    { text: 'Quick' },
    { text: 'FoX' },
    { text: 'JUMPs' },
  ];
  expect(filter.apply(input)).toEqual([
    { text: 'THE' },
    { text: 'QUICK' },
    { text: 'FOX' },
    { text: 'JUMPS' },
  ]);
});
