import StandardTokenizer from '../tokenizers/StandardTokenizer.js';
import LowerCaseFilter from '../filters/LowerCaseFilter.js';
import StopFilter, { type StopFilterOptions } from '../filters/StopFilter.js';
import Analyzer from './Analyzer.js';

export interface StandardAnalyzerOptions {
  /** The maximum token length. If a token is seen that exceeds this length then it is split at max_token_length intervals. */
  maxTokenLength?: number;
  /** A pre-defined stop words list like _english_ or an array containing a list of stop words. */
  stopWords?: StopFilterOptions['stopWords'];
}

class StandardAnalyzer extends Analyzer {
  static override async getInstance(options?: StandardAnalyzerOptions) {
    return new StandardAnalyzer({
      tokenizer: await StandardTokenizer.getInstance({ maxTokenLength: options?.maxTokenLength }),
      filters: [
        LowerCaseFilter(),
        StopFilter({ stopWords: options?.stopWords ?? '_none_' }),
      ],
    });
  }
}

export default StandardAnalyzer;
