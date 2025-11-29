import TokenFilter, { type Token } from './TokenFilter.js';

export interface ShingleFilterOptions {
  /** Maximum number of tokens to concatenate when creating shingles. */
  maxShingleSize?: number;
  /** Minimum number of tokens to concatenate when creating shingles. */
  minShingleSize?: number;
  /** If true, the output includes the original input tokens. If false, the output only includes shingles; the original input tokens are removed. */
  outputUnigrams?: boolean;
  /** Separator used to concatenate adjacent tokens to form a shingle. */
  tokenSeparator?: string;
}

class ShingleFilter extends TokenFilter {
  private maxShingleSize: number;
  private minShingleSize: number;
  private outputUnigrams: boolean;
  private tokenSeparator: string;

  constructor({ maxShingleSize = 2, minShingleSize = 2, outputUnigrams = true, tokenSeparator = ' ' }: ShingleFilterOptions = {}) {
    super();
    this.maxShingleSize = maxShingleSize;
    this.minShingleSize = minShingleSize;
    this.outputUnigrams = outputUnigrams;
    this.tokenSeparator = tokenSeparator;
  }

  override apply(tokens: Token[]) {
    const result: Token[] = [];
    for (let i = 0; i < tokens.length; i++) {
      if (this.outputUnigrams) {
        result.push(tokens[i]);
      }
      for (let j = this.minShingleSize; j <= this.maxShingleSize && i + j <= tokens.length; j++) {
        result.push({
          token: tokens.slice(i, i + j).map(token => token.token).join(this.tokenSeparator),
          startOffset: tokens[i].startOffset,
          endOffset: tokens[i + j - 1].endOffset,
          position: tokens[i].position,
        });
      }
    }
    return result;
  }
}

export default ShingleFilter;
