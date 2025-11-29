import TokenFilter, { type Token } from './TokenFilter.js';

class ApostropheFilter extends TokenFilter {
  override apply(tokens: Token[]) {
    return tokens.map(token => ({ ...token, token: token.token.replace(/[\u0027\u2019\u02bc\uff07].*$/, '') }));
  }
}

export default ApostropheFilter;
