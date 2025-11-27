import CharacterFilter from 'dynamosearch/char_filters/CharacterFilter';

export interface KuromojiIterationMarkCharFilterOptions {
  /** Indicates whether kanji iteration marks should be normalized. */
  normalizeKanji?: boolean;
  /** Indicates whether kana iteration marks should be normalized. */
  normalizeKana?: boolean;
}

class KuromojiIterationMarkCharFilter extends CharacterFilter {
  private normalizeKanji: boolean;
  private normalizeKana: boolean;

  static readonly kanaSet = new Set([
    'か', 'き', 'く', 'け', 'こ',
    'さ', 'し', 'す', 'せ', 'そ',
    'た', 'ち', 'つ', 'て', 'と',
    'は', 'ひ', 'ふ', 'へ', 'ほ',
    'カ', 'キ', 'ク', 'ケ', 'コ',
    'サ', 'シ', 'ス', 'セ', 'ソ',
    'タ', 'チ', 'ツ', 'テ', 'ト',
    'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  ]);

  constructor({ normalizeKanji = true, normalizeKana = true }: KuromojiIterationMarkCharFilterOptions = {}) {
    super();
    this.normalizeKanji = normalizeKanji;
    this.normalizeKana = normalizeKana;
  }

  override apply(str: string) {
    const chars = str.split('');
    for (let i = 1; i < chars.length; i++) {
      if (this.normalizeKanji && chars[i] === '々') {
        chars[i] = chars[i - 1];
        continue;
      }
      if (this.normalizeKana && (chars[i] === 'ゝ' || chars[i] === 'ヽ')) {
        chars[i] = chars[i - 1];
        continue;
      }
      if (this.normalizeKana && (chars[i] === 'ゞ' || chars[i] === 'ヾ')) {
        if (KuromojiIterationMarkCharFilter.kanaSet.has(chars[i - 1])) {
          chars[i] = String.fromCharCode(chars[i - 1].charCodeAt(0) + 1);
          continue;
        }
        chars[i] = chars[i - 1];
        continue;
      }
    }
    return chars.join('');
  }
}

export default KuromojiIterationMarkCharFilter;
