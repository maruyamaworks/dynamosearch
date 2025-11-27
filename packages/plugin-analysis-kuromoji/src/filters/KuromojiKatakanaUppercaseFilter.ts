import TokenFilter from 'dynamosearch/filters/TokenFilter';

class KuromojiKatakanaUppercaseFilter extends TokenFilter {
  static readonly kanaSet = new Set(['ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ャ', 'ュ', 'ョ', 'ッ', 'ヮ', 'ヵ', 'ヶ']);

  override apply(tokens: { text: string }[]) {
    return tokens.map((item) => ({ ...item, text: item.text.split('').map(char => KuromojiKatakanaUppercaseFilter.kanaSet.has(char) ? String.fromCharCode(char.charCodeAt(0) + 1) : char).join('') }));
  }
}

export default KuromojiKatakanaUppercaseFilter;
