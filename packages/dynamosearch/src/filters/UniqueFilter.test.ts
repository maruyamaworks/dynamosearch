import { test, expect } from 'vitest';
import UniqueFilter from './UniqueFilter.js';

test('UniqueFilter', () => {
  const filter = new UniqueFilter();
  const input = [
    { text: 'the' },
    { text: 'quick' },
    { text: 'fox' },
    { text: 'jumps' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'fox' },
  ];
  expect(filter.apply(input)).toEqual([
    { text: 'the' },
    { text: 'quick' },
    { text: 'fox' },
    { text: 'jumps' },
    { text: 'lazy' },
  ]);
});
