import TokenFilter, { type Token } from './TokenFilter.js';

export interface ConditionalTokenFilterOptions {
  /** Array of token filters. If a token matches the predicate script in the script parameter, these filters are applied to the token in the order provided. */
  filters: TokenFilter[];
  /** Predicate script used to apply token filters. If a token matches this script, the filters in the filter parameter are applied to the token. */
  script: (token: Token) => boolean;
}

class ConditionalTokenFilter extends TokenFilter {
  private filters: TokenFilter[];
  private script: (token: Token) => boolean;

  constructor({ filters, script }: ConditionalTokenFilterOptions) {
    super();
    this.filters = filters;
    this.script = script;
  }

  override apply(tokens: Token[]) {
    return tokens.flatMap(token => {
      if (this.script(token)) {
        let result = [token];
        for (let i = 0; i < this.filters.length; i++) {
          result = this.filters[i].apply(result);
        }
        return result;
      }
      return token;
    });
  }
}

export default ConditionalTokenFilter;
