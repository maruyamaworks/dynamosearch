import TokenFilter, { type Token } from './TokenFilter.js';

class ASCIIFoldingFilter extends TokenFilter {
  override apply(tokens: Token[]) {
    return tokens.map(token => ({ ...token, token: token.token.normalize('NFD').replace(/[\u0300-\u036f]/g, '') }));
  }
}

export default ASCIIFoldingFilter;
