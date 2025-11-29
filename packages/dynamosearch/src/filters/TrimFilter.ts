import TokenFilter, { type Token } from './TokenFilter.js';

class TrimFilter extends TokenFilter {
  override apply(tokens: Token[]) {
    return tokens.map(token => ({ ...token, token: token.token.trim() }));
  }
}

export default TrimFilter;
