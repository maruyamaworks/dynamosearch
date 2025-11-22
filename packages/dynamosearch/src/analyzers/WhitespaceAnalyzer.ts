import WhitespaceTokenizer from '../tokenizers/WhitespaceTokenizer.js';
import Analyzer from './Analyzer.js';

class WhitespaceAnalyzer extends Analyzer {
  constructor() {
    super({
      tokenizer: new WhitespaceTokenizer(),
      filters: [],
    });
  }
}

export default WhitespaceAnalyzer;
