import TokenFilter, { type Token } from 'dynamosearch/filters/TokenFilter';

export interface KuromojiKatakanaStemFilterOptions {
  /** Katakana words shorter than the minimumLength are not stemmed. */
  minimumLength?: number;
}

class KuromojiKatakanaStemFilter extends TokenFilter {
  private minimumLength: number;

  constructor({ minimumLength = 4 }: KuromojiKatakanaStemFilterOptions = {}) {
    super();
    this.minimumLength = minimumLength;
  }

  override apply(tokens: Token[]) {
    return tokens.map((item) => ({ ...item, token: item.token.length < this.minimumLength ? item.token : item.token.replace(/ー$/, '') }));
  }
}

export default KuromojiKatakanaStemFilter;
