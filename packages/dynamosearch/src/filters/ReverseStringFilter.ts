import TokenFilter from './TokenFilter.js';

class ReverseStringFilter extends TokenFilter {
  override apply(tokens: { text: string }[]) {
    return tokens.map(token => ({ ...token, text: token.text.split('').reverse().join('') }));
  }
}

export default ReverseStringFilter;
