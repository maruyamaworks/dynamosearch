import type { IpadicFeatures } from 'kuromoji';

export interface KuromojiPartOfSpeechStopFilterOptions {
  /** An array of part-of-speech tags that should be removed. */
  stopTags?: Set<string>;
}

/**
 * https://github.com/apache/lucene/blob/main/lucene/analysis/kuromoji/src/resources/org/apache/lucene/analysis/ja/stoptags.txt
 */
const DEFAULT_STOP_TAGS = new Set([
  '接続詞',
  '助詞',
  '助詞-格助詞',
  '助詞-格助詞-一般',
  '助詞-格助詞-引用',
  '助詞-格助詞-連語',
  '助詞-接続助詞',
  '助詞-係助詞',
  '助詞-副助詞',
  '助詞-間投助詞',
  '助詞-並立助詞',
  '助詞-終助詞',
  '助詞-副助詞／並立助詞／終助詞',
  '助詞-連体化',
  '助詞-副詞化',
  '助詞-特殊',
  '助動詞',
  '記号',
  '記号-一般',
  '記号-読点',
  '記号-句点',
  '記号-空白',
  '記号-括弧開',
  '記号-括弧閉',
  'その他-間投',
  'フィラー',
  '非言語音',
]);

const KuromojiPartOfSpeechStopFilter = ({ stopTags = DEFAULT_STOP_TAGS }: KuromojiPartOfSpeechStopFilterOptions = {}) => (tokens: { text: string; metadata?: IpadicFeatures }[]) => {
  return tokens.filter(({ metadata }) => {
    if (!metadata) {
      return true;
    }
    const pos = [metadata.pos, metadata.pos_detail_1, metadata.pos_detail_2, metadata.pos_detail_3].filter(item => !!item && item !== '*').join('-');
    return !stopTags.has(pos);
  });
};

export default KuromojiPartOfSpeechStopFilter;
