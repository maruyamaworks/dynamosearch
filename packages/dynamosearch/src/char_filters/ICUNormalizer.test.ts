import { test, expect } from 'vitest';
import ICUNormalizer from './ICUNormalizer.js';

test('ICUNormalizer', () => {
  const filter = new ICUNormalizer();
  expect(filter.apply('ﬀ')).toEqual('ff');
});
