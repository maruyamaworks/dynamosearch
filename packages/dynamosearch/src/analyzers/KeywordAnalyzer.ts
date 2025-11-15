import KeywordTokenizer from '../tokenizers/KeywordTokenizer.js';
import Analyzer from './Analyzer.js';

class KeywordAnalyzer extends Analyzer {
  static override async getInstance() {
    return new KeywordAnalyzer({
      tokenizer: await KeywordTokenizer.getInstance(),
      filters: [],
    });
  }
}

export default KeywordAnalyzer;
