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
  constructor({ pattern = /\W+/, lowercase = true, stopWords = '_none_' }: PatternAnalyzerOptions = {}) {
    super({
      tokenizer: new PatternTokenizer({ pattern }),
      filters: [
        ...(lowercase ? [
          new LowerCaseFilter(),
        ] : []),
        new StopFilter({ stopWords }),
      ],
    });
  }
}

export default PatternAnalyzer;
