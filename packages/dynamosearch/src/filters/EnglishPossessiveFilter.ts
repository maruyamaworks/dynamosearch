import TokenFilter, { type Token } from './TokenFilter.js';

class EnglishPossessiveFilter extends TokenFilter {
  override apply(tokens: Token[]) {
    return tokens.map(token => ({ ...token, token: token.token.replace(/[\u0027\u2019\u02bc\uff07][sS]$/, '') }));
  }
}

export default EnglishPossessiveFilter;
