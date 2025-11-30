import StandardTokenizer from '../tokenizers/StandardTokenizer.js';
import ElisionFilter from '../filters/ElisionFilter.js';
import LowerCaseFilter from '../filters/LowerCaseFilter.js';
import StopFilter from '../filters/StopFilter.js';
import SnowballFilter from '../filters/SnowballFilter.js';
import Analyzer from './Analyzer.js';

class FrenchAnalyzer extends Analyzer {
  constructor() {
    super({
      tokenizer: new StandardTokenizer(),
      filters: [
        new ElisionFilter({ articles: ['l', 'm', 't', 'qu', 'n', 's', 'j', 'd', 'c', 'jusqu', 'quoiqu', 'lorsqu', 'puisqu'], ignoreCase: true }),
        new LowerCaseFilter(),
        new StopFilter({ stopWords: '_french_' }),
        new SnowballFilter({ language: 'French' }),
      ],
    });
  }
}

export default FrenchAnalyzer;
