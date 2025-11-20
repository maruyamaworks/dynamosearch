import LowerCaseTokenizer from '../tokenizers/LowerCaseTokenizer.js';
import StopFilter, { type StopFilterOptions } from '../filters/StopFilter.js';
import Analyzer from './Analyzer.js';

export interface StopAnalyzerOptions {
  /** A pre-defined stop words list like _english_ or an array containing a list of stop words. */
  stopWords?: StopFilterOptions['stopWords'];
}

class StopAnalyzer extends Analyzer {
  static override async getInstance(options?: StopAnalyzerOptions) {
    return new StopAnalyzer({
      tokenizer: await LowerCaseTokenizer.getInstance(),
      filters: [
        StopFilter({ stopWords: options?.stopWords ?? '_english_' }),
      ],
    });
  }
}

export default StopAnalyzer;
