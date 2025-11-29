import TokenFilter, { type Token } from './TokenFilter.js';

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

  override apply(tokens: Token[]) {
    return tokens.map(token => ({ ...token, token: token.token.slice(0, this.length) }));
  }
}

export default TruncateFilter;
