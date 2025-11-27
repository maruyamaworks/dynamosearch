import TokenFilter from './TokenFilter.js';

class UpperCaseFilter extends TokenFilter {
  override apply(tokens: { text: string }[]) {
    return tokens.map(token => ({ ...token, text: token.text.toUpperCase() }));
  }
}

export default UpperCaseFilter;
