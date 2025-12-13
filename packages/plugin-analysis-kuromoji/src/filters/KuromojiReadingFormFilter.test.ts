import { test, expect } from 'vitest';
import KuromojiReadingFormFilter from './KuromojiReadingFormFilter.js';

test('KuromojiReadingFormFilter', () => {
  const filter = new KuromojiReadingFormFilter();
  const input = [
    {
      token: '寿司',
      startOffset: 0,
      endOffset: 2,
      position: 0,
      metadata: {
        word_id: 2747750,
        word_type: 'KNOWN',
        word_position: 1,
        surface_form: '寿司',
        pos: '名詞',
        pos_detail_1: '一般',
        pos_detail_2: '*',
        pos_detail_3: '*',
        conjugated_type: '*',
        conjugated_form: '*',
        basic_form: '寿司',
        reading: 'スシ',
        pronunciation: 'スシ',
      },
    },
  ];
  expect(filter.apply(input)).toEqual([
    { token: 'スシ', startOffset: 0, endOffset: 2, position: 0, metadata: input[0].metadata },
  ]);
});
