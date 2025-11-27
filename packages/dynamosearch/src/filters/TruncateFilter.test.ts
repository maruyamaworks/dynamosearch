import { test, expect } from 'vitest';
import TruncateFilter from './TruncateFilter.js';

test('TruncateFilter', () => {
  const filter = new TruncateFilter();
  const input = [
    { text: 'the' },
    { text: 'quinquennial' },
    { text: 'extravaganza' },
    { text: 'carried' },
    { text: 'on' },
  ];
  expect(filter.apply(input)).toEqual([
    { text: 'the' },
    { text: 'quinquenni' },
    { text: 'extravagan' },
    { text: 'carried' },
    { text: 'on' },
  ]);
});
