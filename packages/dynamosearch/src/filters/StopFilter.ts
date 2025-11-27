import TokenFilter from './TokenFilter.js';
import * as PredefinedStopWords from './stopwords/index.js';

export interface StopFilterOptions {
  /** A pre-defined stop words list like _english_ or an array containing a list of stop words. */
  stopWords?: keyof typeof PredefinedStopWords | string[];
}

class StopFilter extends TokenFilter {
  private stopWordSet: Set<string>;

  constructor({ stopWords = '_english_' }: StopFilterOptions = {}) {
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

  override apply(tokens: { text: string }[]) {
    return tokens.filter(token => !this.stopWordSet.has(token.text));
  }
}

export default StopFilter;
