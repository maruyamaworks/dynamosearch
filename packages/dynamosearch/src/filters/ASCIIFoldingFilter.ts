import TokenFilter from './TokenFilter.js';

class ASCIIFoldingFilter extends TokenFilter {
  override apply(tokens: { text: string }[]) {
    return tokens.map(token => ({ ...token, text: token.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') }));
  }
}

export default ASCIIFoldingFilter;
