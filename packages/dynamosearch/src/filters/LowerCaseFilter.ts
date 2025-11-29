import TokenFilter, { type Token } from './TokenFilter.js';

class LowerCaseFilter extends TokenFilter {
  override apply(tokens: Token[]) {
    return tokens.map(token => ({ ...token, token: token.token.toLowerCase() }));
  }
}

export default LowerCaseFilter;
