import TokenFilter from './TokenFilter.js';

export interface TruncateFilterOptions {
  /** Character limit for each token. Tokens exceeding this limit are truncated. */
  length?: number;
}

class TruncateFilter extends TokenFilter {
  private length: number;

  constructor({ length = 10 }: TruncateFilterOptions = {}) {
    super();
    this.length = length;
  }

  override apply(tokens: { text: string }[]) {
    return tokens.map(token => ({ ...token, text: token.text.slice(0, this.length) }));
  }
}

export default TruncateFilter;
