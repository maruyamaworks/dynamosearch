import TokenFilter, { type Token } from './TokenFilter.js';

export interface EdgeNGramTokenFilterOptions {
  /** Maximum length of characters in a gram. */
  maxGram?: number;
  /** Minimum length of characters in a gram. */
  minGram?: number;
  /** Emits original token when set to true. */
  preserveOriginal?: boolean;
}

class EdgeNGramTokenFilter extends TokenFilter {
  private maxGram: number;
  private minGram: number;
  private preserveOriginal: boolean;

  constructor({ maxGram = 2, minGram = 1, preserveOriginal = false }: EdgeNGramTokenFilterOptions = {}) {
    super();
    this.maxGram = maxGram;
    this.minGram = minGram;
    this.preserveOriginal = preserveOriginal;
  }

  override apply(tokens: Token[]) {
    return tokens.flatMap(token => {
      const result: Token[] = [];
      for (let i = this.minGram; i <= this.maxGram && i <= token.token.length; i++) {
        result.push({ ...token, token: token.token.slice(0, i) });
      }
      if (token.token.length > this.maxGram && this.preserveOriginal) {
        result.push(token);
      }
      return result;
    });
  }
}

export default EdgeNGramTokenFilter;
