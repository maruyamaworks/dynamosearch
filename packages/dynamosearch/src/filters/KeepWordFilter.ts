import TokenFilter, { type Token } from './TokenFilter.js';

export interface KeepWordFilterOptions {
  /** List of words to keep. Only tokens that match words in this list are included in the output. */
  keepWords: string[];
}

class KeepWordFilter extends TokenFilter {
  private keepWordSet: Set<string>;

  constructor({ keepWords }: KeepWordFilterOptions) {
    super();
    this.keepWordSet = new Set(keepWords);
  }

  override apply(tokens: Token[]) {
    return tokens.filter(token => this.keepWordSet.has(token.token));
  }
}

export default KeepWordFilter;
