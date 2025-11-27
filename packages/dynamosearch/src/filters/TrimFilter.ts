import TokenFilter from './TokenFilter.js';

class TrimFilter extends TokenFilter {
  override apply(tokens: { text: string }[]) {
    return tokens.map(token => ({ ...token, text: token.text.trim() }));
  }
}

export default TrimFilter;
