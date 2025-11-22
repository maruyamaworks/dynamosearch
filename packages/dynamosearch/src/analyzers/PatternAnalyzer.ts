import PatternTokenizer from '../tokenizers/PatternTokenizer.js';
import LowerCaseFilter from '../filters/LowerCaseFilter.js';
import StopFilter, { type StopFilterOptions } from '../filters/StopFilter.js';
import Analyzer from './Analyzer.js';

export interface PatternAnalyzerOptions {
  /** A regular expression. */
  pattern?: RegExp;
  /** Should terms be lowercased or not. */
  lowercase?: boolean;
  /** A pre-defined stop words list like _english_ or an array containing a list of stop words. */
  stopWords?: StopFilterOptions['stopWords'];
}

class PatternAnalyzer extends Analyzer {
  static override async getInstance(options?: PatternAnalyzerOptions) {
    return new PatternAnalyzer({
      tokenizer: await PatternTokenizer.getInstance({ pattern: options?.pattern ?? /\W+/ }),
      filters: [
        ...((options?.lowercase ?? true) ? [LowerCaseFilter()] : []),
        StopFilter({ stopWords: options?.stopWords ?? '_none_' }),
      ],
    });
  }
}

export default PatternAnalyzer;
