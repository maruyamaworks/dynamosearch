import TokenFilter, { type Token } from './TokenFilter.js';

export interface NGramTokenFilterOptions {
  /** Maximum length of characters in a gram. */
  maxGram?: number;
  /** Minimum length of characters in a gram. */
  minGram?: number;
  /** Emits original token when set to true. */
  preserveOriginal?: boolean;
}

class NGramTokenFilter extends TokenFilter {
  private maxGram: number;
  private minGram: number;
  private preserveOriginal: boolean;

  constructor({ maxGram = 2, minGram = 1, preserveOriginal = false }: NGramTokenFilterOptions = {}) {
    super();
    this.maxGram = maxGram;
    this.minGram = minGram;
    this.preserveOriginal = preserveOriginal;
  }

  override apply(tokens: Token[]) {
    return tokens.flatMap(token => {
      const result: Token[] = [];
      for (let i = 0; i < token.token.length; i++) {
        for (let j = this.minGram; j <= this.maxGram && i + j <= token.token.length; j++) {
          result.push({ ...token, token: token.token.slice(i, i + j) });
        }
      }
      if (token.token.length > this.maxGram && this.preserveOriginal) {
        result.push(token);
      }
      return result;
    });
  }
}

export default NGramTokenFilter;
