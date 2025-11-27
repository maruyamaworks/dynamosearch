import { test, expect } from 'vitest';
import LowerCaseFilter from './LowerCaseFilter.js';

test('LowerCaseFilter', () => {
  const filter = new LowerCaseFilter();
  const input = [
    { text: 'THE' },
    { text: 'Quick' },
    { text: 'FoX' },
    { text: 'JUMPs' },
  ];
  expect(filter.apply(input)).toEqual([
    { text: 'the' },
    { text: 'quick' },
    { text: 'fox' },
    { text: 'jumps' },
  ]);
});
