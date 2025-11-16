import * as PredefinedStopWords from './stopwords/index.js';

export interface StopFilterOptions {
  /** A pre-defined stop words list like _english_ or an array containing a list of stop words. */
  stopWords?: keyof typeof PredefinedStopWords | string[];
}

const StopFilter = ({ stopWords = '_english_' }: StopFilterOptions = {}) => {
  let stopWordSet: Set<string>;
  if (typeof stopWords === 'string') {
    stopWordSet = new Set(PredefinedStopWords[stopWords]);
  } else {
    stopWordSet = new Set();
    for (let i = 0; i < stopWords.length; i++) {
      if (Object.keys(PredefinedStopWords).includes(stopWords[i])) {
        const key = stopWords[i] as keyof typeof PredefinedStopWords;
        PredefinedStopWords[key].forEach(word => stopWordSet.add(word));
      } else {
        stopWordSet.add(stopWords[i]);
      }
    }
  }
  return (tokens: { text: string }[]) => {
    return tokens.filter(token => !stopWordSet.has(token.text));
  };
};

export default StopFilter;
