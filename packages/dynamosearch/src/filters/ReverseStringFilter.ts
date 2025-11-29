import TokenFilter, { type Token } from './TokenFilter.js';

class ReverseStringFilter extends TokenFilter {
  override apply(tokens: Token[]) {
    return tokens.map(token => ({ ...token, token: token.token.split('').reverse().join('') }));
  }
}

export default ReverseStringFilter;
