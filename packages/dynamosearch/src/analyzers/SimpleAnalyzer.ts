import LowerCaseTokenizer from '../tokenizers/LowerCaseTokenizer.js';
import Analyzer from './Analyzer.js';

class SimpleAnalyzer extends Analyzer {
  static override async getInstance() {
    return new SimpleAnalyzer({
      tokenizer: await LowerCaseTokenizer.getInstance(),
      filters: [],
    });
  }
}

export default SimpleAnalyzer;
