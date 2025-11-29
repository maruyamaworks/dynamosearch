import { test, expect } from 'vitest';
import ElisionFilter from './ElisionFilter.js';

test('ElisionFilter', () => {
  const filter = new ElisionFilter({ articles: ['l', 'm', 't', 'qu', 'n', 's', 'j'] });
  const input = [
    { token: 'j’examine', startOffset: 0, endOffset: 9, position: 0 },
    { token: 'près', startOffset: 10, endOffset: 14, position: 1 },
    { token: 'du', startOffset: 15, endOffset: 17, position: 2 },
    { token: 'wharf', startOffset: 18, endOffset: 23, position: 3 },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'examine', startOffset: 0, endOffset: 9, position: 0 },
    { token: 'près', startOffset: 10, endOffset: 14, position: 1 },
    { token: 'du', startOffset: 15, endOffset: 17, position: 2 },
    { token: 'wharf', startOffset: 18, endOffset: 23, position: 3 },
  ]);
});
