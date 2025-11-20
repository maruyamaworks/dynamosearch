import WhitespaceTokenizer from '../tokenizers/WhitespaceTokenizer.js';
import Analyzer from './Analyzer.js';

class WhitespaceAnalyzer extends Analyzer {
  static override async getInstance() {
    return new WhitespaceAnalyzer({
      tokenizer: await WhitespaceTokenizer.getInstance(),
      filters: [],
    });
  }
}

export default WhitespaceAnalyzer;
