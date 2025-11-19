import { test, expect } from 'vitest';
import KuromojiIterationMarkCharFilter from './KuromojiIterationMarkCharFilter.js';

test('KuromojiIterationMarkCharFilter', () => {
  const filter = KuromojiIterationMarkCharFilter();

  const input = '人々がすゝめの声を聞きながらつゞく小道を歩いた';
  expect(filter(input)).toEqual('人人がすすめの声を聞きながらつづく小道を歩いた');
});
