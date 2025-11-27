import TokenFilter from './TokenFilter.js';

class LowerCaseFilter extends TokenFilter {
  override apply(tokens: { text: string }[]) {
    return tokens.map(token => ({ ...token, text: token.text.toLowerCase() }));
  }
}

export default LowerCaseFilter;
