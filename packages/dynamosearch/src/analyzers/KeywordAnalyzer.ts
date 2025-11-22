import KeywordTokenizer from '../tokenizers/KeywordTokenizer.js';
import Analyzer from './Analyzer.js';

class KeywordAnalyzer extends Analyzer {
  constructor() {
    super({
      tokenizer: new KeywordTokenizer(),
      filters: [],
    });
  }
}

export default KeywordAnalyzer;
