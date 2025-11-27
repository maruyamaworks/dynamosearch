import { test, expect } from 'vitest';
import ReverseStringFilter from './ReverseStringFilter.js';

test('ReverseStringFilter', () => {
  const filter = new ReverseStringFilter();
  const input = [
    { text: 'quick' },
    { text: 'fox' },
    { text: 'jumps' },
  ];
  expect(filter.apply(input)).toEqual([
    { text: 'kciuq' },
    { text: 'xof' },
    { text: 'spmuj' },
  ]);
});
