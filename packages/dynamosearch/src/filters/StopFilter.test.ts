import { test, expect } from 'vitest';
import StopFilter from './StopFilter.js';

test('StopFilter', () => {
  const filter = StopFilter();
  const input = [
    { text: 'a' },
    { text: 'quick' },
    { text: 'fox' },
    { text: 'jumps' },
    { text: 'over' },
    { text: 'the' },
    { text: 'lazy' },
    { text: 'dog' },
  ];
  expect(filter(input)).toEqual([
    { text: 'quick' },
    { text: 'fox' },
    { text: 'jumps' },
    { text: 'over' },
    { text: 'lazy' },
    { text: 'dog' },
  ]);
});
