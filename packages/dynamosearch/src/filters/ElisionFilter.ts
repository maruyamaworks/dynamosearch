import TokenFilter, { type Token } from './TokenFilter.js';

export interface ElisionFilterOptions {
  /** List of elisions to remove. */
  articles: string[];
  /** If true, elision matching is case insensitive. If false, elision matching is case sensitive. */
  ignoreCase?: boolean;
}

class ApostropheFilter extends TokenFilter {
  private pattern: RegExp;

  constructor({ articles, ignoreCase = false }: ElisionFilterOptions) {
    super();
    this.pattern = new RegExp(`^(${articles.join('|')})[\u0027\u2019\u02bc\uff07]`, ignoreCase ? 'i' : '');
  }

  override apply(tokens: Token[]) {
    return tokens.map(token => ({ ...token, token: token.token.replace(this.pattern, '') }));
  }
}

export default ApostropheFilter;
