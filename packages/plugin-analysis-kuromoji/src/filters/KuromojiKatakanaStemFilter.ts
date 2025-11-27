import TokenFilter from 'dynamosearch/filters/TokenFilter';

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

  override apply(tokens: { text: string }[]) {
    return tokens.map((item) => ({ ...item, text: item.text.length < this.minimumLength ? item.text : item.text.replace(/ー$/, '') }));
  }
}

export default KuromojiKatakanaStemFilter;
