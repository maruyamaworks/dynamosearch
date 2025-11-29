import TokenFilter, { type Token } from 'dynamosearch/filters/TokenFilter';

class KuromojiKatakanaUppercaseFilter extends TokenFilter {
  static readonly kanaSet = new Set(['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゃ', 'ゅ', 'ょ', 'っ', 'ゎ']);

  override apply(tokens: Token[]) {
    return tokens.map((item) => ({ ...item, token: item.token.split('').map(char => KuromojiKatakanaUppercaseFilter.kanaSet.has(char) ? String.fromCharCode(char.charCodeAt(0) + 1) : char).join('') }));
  }
}

export default KuromojiKatakanaUppercaseFilter;
