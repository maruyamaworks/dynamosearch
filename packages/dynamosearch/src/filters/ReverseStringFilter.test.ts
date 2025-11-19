import { test, expect } from 'vitest';
import ReverseStringFilter from './ReverseStringFilter.js';

test('ReverseStringFilter', () => {
  const filter = ReverseStringFilter();
  const input = [
    { text: 'quick' },
    { text: 'fox' },
    { text: 'jumps' },
  ];
  expect(filter(input)).toEqual([
    { text: 'kciuq' },
    { text: 'xof' },
    { text: 'spmuj' },
  ]);
});
