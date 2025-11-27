import TokenFilter from './TokenFilter.js';

export interface LimitTokenCountFilterOptions {
  /** Maximum number of tokens to keep. Once this limit is reached, any remaining tokens are excluded from the output. */
  maxTokenCount?: number;
}

class LimitTokenCountFilter extends TokenFilter {
  private maxTokenCount: number;

  constructor({ maxTokenCount = 1 }: LimitTokenCountFilterOptions = {}) {
    super();
    this.maxTokenCount = maxTokenCount;
  }

  override apply(tokens: { text: string }[]) {
    return tokens.slice(0, this.maxTokenCount);
  }
}

export default LimitTokenCountFilter;
