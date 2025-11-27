import { test, expect } from 'vitest';
import TrimFilter from './TrimFilter.js';

test('TrimFilter', () => {
  const filter = new TrimFilter();
  const input = [
    { text: ' fox ' },
  ];
  expect(filter.apply(input)).toEqual([
    { text: 'fox' },
  ]);
});
