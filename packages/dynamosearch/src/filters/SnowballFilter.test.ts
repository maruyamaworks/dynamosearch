import { test, expect } from 'vitest';
import SnowballFilter from './SnowballFilter.js';

test('SnowballFilter', () => {
  const filter = SnowballFilter();
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
    { text: 'quick' },
  ]);
});
