import TokenFilter, { type Token } from 'dynamosearch/filters/TokenFilter';
import type { IpadicFeatures } from 'kuromoji';

export interface KuromojiReadingFormFilterOptions {
  /** Whether romaji reading form should be output instead of katakana. */
  useRomaji?: boolean;
}

const katakanaToRomaji = (katakana: string) => {
  const kanaMap: Record<string, string> = {
    'ア': 'a',   'イ': 'i',   'ウ': 'u',   'エ': 'e',   'オ': 'o',
    'カ': 'ka',  'キ': 'ki',  'ク': 'ku',  'ケ': 'ke',  'コ': 'ko',
    'サ': 'sa',  'シ': 'shi', 'ス': 'su',  'セ': 'se',  'ソ': 'so',
    'タ': 'ta',  'チ': 'chi', 'ツ': 'tsu', 'テ': 'te',  'ト': 'to',
    'ナ': 'na',  'ニ': 'ni',  'ヌ': 'nu',  'ネ': 'ne',  'ノ': 'no',
    'ハ': 'ha',  'ヒ': 'hi',  'フ': 'fu',  'ヘ': 'he',  'ホ': 'ho',
    'マ': 'ma',  'ミ': 'mi',  'ム': 'mu',  'メ': 'me',  'モ': 'mo',
    'ヤ': 'ya',               'ユ': 'yu',               'ヨ': 'yo',
    'ラ': 'ra',  'リ': 'ri',  'ル': 'ru',  'レ': 're',  'ロ': 'ro',
    'ワ': 'wa',                                         'ヲ': 'wo',
    'ン': 'n',

    'ガ': 'ga',  'ギ': 'gi',  'グ': 'gu',  'ゲ': 'ge',  'ゴ': 'go',
    'ザ': 'za',  'ジ': 'ji',  'ズ': 'zu',  'ゼ': 'ze',  'ゾ': 'zo',
    'ダ': 'da',  'ヂ': 'ji',  'ヅ': 'zu',  'デ': 'de',  'ド': 'do',
    'バ': 'ba',  'ビ': 'bi',  'ブ': 'bu',  'ベ': 'be',  'ボ': 'bo',
    'パ': 'pa',  'ピ': 'pi',  'プ': 'pu',  'ペ': 'pe',  'ポ': 'po',

    'キャ': 'kya',  'キュ': 'kyu',                  'キョ': 'kyo',
    'シャ': 'sha',  'シュ': 'shu',  'シェ': 'she',  'ショ': 'sho',
    'チャ': 'cha',  'チュ': 'chu',  'チェ': 'che',  'チョ': 'cho',
    'ニャ': 'nya',  'ニュ': 'nyu',                  'ニョ': 'nyo',
    'ヒャ': 'hya',  'ヒュ': 'hyu',                  'ヒョ': 'hyo',
    'ミャ': 'mya',  'ミュ': 'myu',                  'ミョ': 'myo',
    'リャ': 'rya',  'リュ': 'ryu',                  'リョ': 'ryo',
    'ギャ': 'gya',  'ギュ': 'gyu',                  'ギョ': 'gyo',
    'ジャ': 'ja',   'ジュ': 'ju',   'ジェ': 'je',   'ジョ': 'jo',
    'ビャ': 'bya',  'ビュ': 'byu',                  'ビョ': 'byo',
    'ピャ': 'pya',  'ピュ': 'pyu',                  'ピョ': 'pyo',
  };

  let result = '';
  let i = 0;

  while (i < katakana.length) {
    if (i < katakana.length - 1) {
      const twoChars = katakana.substring(i, i + 2);
      if (kanaMap[twoChars]) {
        result += kanaMap[twoChars];
        i += 2;
        continue;
      }
    }
    if (katakana[i] === 'ッ' && i < katakana.length - 1) {
      const nextChar = katakana[i + 1];
      const nextRomaji = kanaMap[nextChar] || kanaMap[katakana.substring(i + 1, i + 3)];
      if (nextRomaji) {
        result += nextRomaji[0];
      }
      i++;
      continue;
    }
    if (katakana[i] === 'ー' && result.length > 0) {
      const lastChar = result[result.length - 1];
      if ('aiueo'.includes(lastChar)) {
        result += lastChar;
      }
      i++;
      continue;
    }
    const char = katakana[i];
    result += kanaMap[char] || char;
    i++;
  }

  return result;
};

class KuromojiReadingFormFilter extends TokenFilter {
  private useRomaji: boolean;

  constructor({ useRomaji = false }: KuromojiReadingFormFilterOptions = {}) {
    super();
    this.useRomaji = useRomaji;
  }

  override apply(tokens: (Token & { metadata?: IpadicFeatures })[]) {
    return tokens.map((item) => {
      if (!item.metadata?.reading || item.metadata.reading === '*') {
        return item;
      }
      return { ...item, token: this.useRomaji ? katakanaToRomaji(item.metadata.reading) : item.metadata.reading };
    });
  }
}

export default KuromojiReadingFormFilter;
