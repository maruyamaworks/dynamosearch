import StandardTokenizer from '../tokenizers/StandardTokenizer.js';
import LowerCaseFilter from '../filters/LowerCaseFilter.js';
import Analyzer from './Analyzer.js';

class StandardAnalyzer extends Analyzer {
  static async getInstance() {
    return new StandardAnalyzer({
      tokenizer: await StandardTokenizer.getInstance(),
      filters: [
        LowerCaseFilter(),
      ],
    });
  }
}

export default StandardAnalyzer;
