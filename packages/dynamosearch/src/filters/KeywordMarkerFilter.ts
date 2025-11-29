import TokenFilter, { type Token } from './TokenFilter.js';

export interface KeywordMarkerFilterOptions {
  /** If true, matching for the keywords and keywords_path parameters ignores letter case. */
  ignoreCase?: boolean;
  /** Array of keywords. Tokens that match these keywords are not stemmed. */
  keywords?: string[];
  /** Regular expression used to match tokens. Tokens that match this expression are marked as keywords and not stemmed. */
  keywordsPattern?: RegExp;
}

class KeywordMarkerFilter extends TokenFilter {
  private ignoreCase: boolean;
  private keywords: string[];
  private keywordsPattern?: RegExp;

  constructor({ ignoreCase = false, keywords = [], keywordsPattern }: KeywordMarkerFilterOptions = {}) {
    super();
    this.ignoreCase = ignoreCase;
    this.keywords = ignoreCase ? keywords.map(word => word.toLowerCase()) : keywords;
    this.keywordsPattern = keywordsPattern;
  }

  override apply(tokens: Token[]) {
    if (this.keywordsPattern) {
      return tokens.map(token => ({ ...token, keyword: this.keywordsPattern!.test(token.token) }));
    }
    return tokens.map(token => ({ ...token, keyword: this.keywords.includes(this.ignoreCase ? token.token.toLowerCase() : token.token) }));
  }
}

export default KeywordMarkerFilter;
