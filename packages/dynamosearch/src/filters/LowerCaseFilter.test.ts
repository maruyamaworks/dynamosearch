import { test, expect } from 'vitest';
import LowerCaseFilter from './LowerCaseFilter.js';

test('LowerCaseFilter', () => {
  const filter = LowerCaseFilter();
  const input = [
    { text: 'THE' },
    { text: 'Quick' },
    { text: 'FoX' },
    { text: 'JUMPs' },
  ];
  expect(filter(input)).toEqual([
    { text: 'the' },
    { text: 'quick' },
    { text: 'fox' },
    { text: 'jumps' },
  ]);
});
