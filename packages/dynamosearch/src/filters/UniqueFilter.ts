import TokenFilter from './TokenFilter.js';

class UniqueFilter extends TokenFilter {
  override apply(tokens: { text: string }[]) {
    return [...new Set(tokens.map(token => token.text))].map(text => ({ text }));
  }
}

export default UniqueFilter;
