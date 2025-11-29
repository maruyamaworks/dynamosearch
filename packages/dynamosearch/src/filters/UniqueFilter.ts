import TokenFilter, { type Token } from './TokenFilter.js';

class UniqueFilter extends TokenFilter {
  override apply(tokens: Token[]) {
    const result: Token[] = [];
    for (let i = 0; i < tokens.length; i++){
      if (result.every(({ token }) => token !== tokens[i].token)) {
        result.push(tokens[i]);
      }
    }
    return result;
  }
}

export default UniqueFilter;
