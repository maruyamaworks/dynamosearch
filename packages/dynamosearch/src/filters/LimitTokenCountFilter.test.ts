import { test, expect } from 'vitest';
import LimitTokenCountFilter from './LimitTokenCountFilter.js';

test('LimitTokenCountFilter', () => {
  const filter = LimitTokenCountFilter({ maxTokenCount: 2 });
  const input = [
    { text: 'quick' },
    { text: 'fox' },
    { text: 'jumps' },
    { text: 'over' },
    { text: 'lazy' },
    { text: 'dog' },
  ];
  expect(filter(input)).toEqual([
    { text: 'quick' },
    { text: 'fox' },
  ]);
});
