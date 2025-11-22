import LowerCaseTokenizer from '../tokenizers/LowerCaseTokenizer.js';
import Analyzer from './Analyzer.js';

class SimpleAnalyzer extends Analyzer {
  constructor() {
    super({
      tokenizer: new LowerCaseTokenizer(),
      filters: [],
    });
  }
}

export default SimpleAnalyzer;
