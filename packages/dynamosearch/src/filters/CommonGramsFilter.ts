import TokenFilter, { type Token } from './TokenFilter.js';

export interface CommonGramsFilterOptions {
  /** A list of tokens. The filter generates bigrams for these tokens. */
  commonWords: string[];
  /** If true, matches for common words matching are case-insensitive. */
  ignoreCase?: boolean;
  /**
   * If true, the filter excludes the following tokens from the output:
   * - Unigrams for common words
   * - Unigrams for terms followed by common words
   */
  queryMode?: boolean;
}

class LowerCaseFilter extends TokenFilter {
  private commonWordSet: Set<string>;
  private ignoreCase: boolean;
  private queryMode: boolean;

  constructor({ commonWords, ignoreCase = false, queryMode = false }: CommonGramsFilterOptions) {
    super();
    this.commonWordSet = new Set(ignoreCase ? commonWords.map(word => word.toLowerCase()) : commonWords);
    this.ignoreCase = ignoreCase;
    this.queryMode = queryMode;
  }

  override apply(tokens: Token[]) {
    const result: Token[] = [];
    for (let i = 0; i < tokens.length; i++) {
      if (this.commonWordSet.has(this.ignoreCase ? tokens[i].token.toLowerCase() : tokens[i].token)) {
        if (i > 0) {
          result.push({
            token: `${tokens[i - 1].token}_${tokens[i].token}`,
            startOffset: tokens[i - 1].startOffset,
            endOffset: tokens[i].endOffset,
            position: tokens[i - 1].position,
          });
        }
        if (!this.queryMode) {
          result.push(tokens[i]);
        }
        if (i < tokens.length - 1) {
          result.push({
            token: `${tokens[i].token}_${tokens[i + 1].token}`,
            startOffset: tokens[i].startOffset,
            endOffset: tokens[i + 1].endOffset,
            position: tokens[i].position,
          });
        }
      } else if (i < tokens.length - 1) {
        if (!this.queryMode || !this.commonWordSet.has(this.ignoreCase ? tokens[i + 1].token.toLowerCase() : tokens[i + 1].token)) {
          result.push(tokens[i]);
        }
      } else {
        if (!this.queryMode || i === 0 || !this.commonWordSet.has(this.ignoreCase ? tokens[i - 1].token.toLowerCase() : tokens[i - 1].token)) {
          result.push(tokens[i]);
        }
      }
    }
    return result;
  }
}

export default LowerCaseFilter;
