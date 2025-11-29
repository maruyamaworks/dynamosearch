import TokenFilter, { type Token } from 'dynamosearch/filters/TokenFilter';
import * as PredefinedStopWords from './stopwords/index.js';

export interface JapaneseStopFilterOptions {
  /** A pre-defined stop words list like _japanese_ or an array containing a list of stop words. */
  stopWords?: keyof typeof PredefinedStopWords | string[];
}

class JapaneseStopFilter extends TokenFilter {
  private stopWordSet: Set<string>;

  constructor({ stopWords = '_japanese_' }: JapaneseStopFilterOptions = {}) {
    super();
    if (typeof stopWords === 'string') {
      this.stopWordSet = new Set(PredefinedStopWords[stopWords]);
      return;
    }
    this.stopWordSet = new Set();
    for (let i = 0; i < stopWords.length; i++) {
      if (Object.keys(PredefinedStopWords).includes(stopWords[i])) {
        const key = stopWords[i] as keyof typeof PredefinedStopWords;
        PredefinedStopWords[key].forEach(word => this.stopWordSet.add(word));
      } else {
        this.stopWordSet.add(stopWords[i]);
      }
    }
  }

  override apply(tokens: Token[]) {
    return tokens.filter(token => !this.stopWordSet.has(token.token));
  }
}

export default JapaneseStopFilter;
