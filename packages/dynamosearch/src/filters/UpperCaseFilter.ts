import TokenFilter, { type Token } from './TokenFilter.js';

class UpperCaseFilter extends TokenFilter {
  override apply(tokens: Token[]) {
    return tokens.map(token => ({ ...token, token: token.token.toUpperCase() }));
  }
}

export default UpperCaseFilter;
