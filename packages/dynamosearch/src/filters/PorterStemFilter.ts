import TokenFilter, { type Token } from './TokenFilter.js';
import { PorterStemmer } from './snowball/index.js';

class PorterStemFilter extends TokenFilter {
  private stemmer: { stemWord: (word: string) => string };

  constructor() {
    super();
    this.stemmer = new PorterStemmer();
  }

  override apply(tokens: Token[]) {
    return tokens.map(token => ({ ...token, token: token.keyword ? token.token : this.stemmer.stemWord(token.token) }));
  }
}

export default PorterStemFilter;
