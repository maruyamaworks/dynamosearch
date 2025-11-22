import { test, expect } from 'vitest';
import TrimFilter from './TrimFilter.js';

test('TrimFilter', () => {
  const filter = TrimFilter();
  const input = [
    { text: ' fox ' },
  ];
  expect(filter(input)).toEqual([
    { text: 'fox' },
  ]);
});
