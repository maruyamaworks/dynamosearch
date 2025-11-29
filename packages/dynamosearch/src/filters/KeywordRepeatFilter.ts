import TokenFilter, { type Token } from './TokenFilter.js';

class KeywordRepeatFilter extends TokenFilter {
  override apply(tokens: Token[]) {
    return tokens.flatMap(token => [{ ...token, keyword: false }, { ...token, keyword: true }]);
  }
}

export default KeywordRepeatFilter;
