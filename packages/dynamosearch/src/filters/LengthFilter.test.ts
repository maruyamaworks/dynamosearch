import { test, expect } from 'vitest';
import LengthFilter from './LengthFilter.js';

test('LengthFilter', () => {
  const filter = new LengthFilter({ min: 0, max: 4 });
  const input = [
    { text: 'the' },
    { text: 'quick' },
    { text: 'brown' },
    { text: 'fox' },
    { text: 'jumps' },
    { text: 'over' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'dog' },
  ];
  expect(filter.apply(input)).toEqual([
    { text: 'the' },
    { text: 'fox' },
    { text: 'over' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'dog' },
  ]);
});
