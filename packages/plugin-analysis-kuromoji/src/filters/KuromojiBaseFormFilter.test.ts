import { test, expect } from 'vitest';
import KuromojiBaseFormFilter from './KuromojiBaseFormFilter.js';

test('KuromojiBaseFormFilter', () => {
  const filter = new KuromojiBaseFormFilter();
  const input = [
    {
      token: '飲み',
      startOffset: 0,
      endOffset: 2,
      position: 0,
      metadata: {
        word_id: 3110870,
        word_type: 'KNOWN',
        word_position: 1,
        surface_form: '飲み',
        pos: '動詞',
        pos_detail_1: '自立',
        pos_detail_2: '*',
        pos_detail_3: '*',
        conjugated_type: '五段・マ行',
        conjugated_form: '連用形',
        basic_form: '飲む',
        reading: 'ノミ',
        pronunciation: 'ノミ',
      },
    },
  ];
  expect(filter.apply(input)).toEqual([
    { token: '飲む', startOffset: 0, endOffset: 2, position: 0, metadata: input[0].metadata },
  ]);
});
