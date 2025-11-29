import TokenFilter, { type Token } from './TokenFilter.js';

export interface LengthFilterOptions {
  /** Minimum character length of a token. Shorter tokens are excluded from the output. */
  min?: number;
  /** Maximum character length of a token. Longer tokens are excluded from the output. */
  max?: number;
}

class LengthFilter extends TokenFilter {
  private min: number;
  private max: number;

  constructor({ min = 0, max = 2147483647 }: LengthFilterOptions = {}) {
    super();
    this.min = min;
    this.max = max;
  }

  override apply(tokens: Token[]) {
    return tokens.filter(token => token.token.length >= this.min && token.token.length <= this.max);
  }
}

export default LengthFilter;
