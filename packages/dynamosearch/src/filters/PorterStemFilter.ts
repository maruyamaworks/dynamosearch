import TokenFilter from './TokenFilter.js';
import { PorterStemmer } from './snowball/index.js';

class PorterStemFilter extends TokenFilter {
  private stemmer: any;

  constructor() {
    super();
    this.stemmer = new PorterStemmer();
  }

  override apply(tokens: { text: string }[]) {
    return tokens.map(token => ({ ...token, text: this.stemmer.stemWord(token.text) }));
  }
}

export default PorterStemFilter;
