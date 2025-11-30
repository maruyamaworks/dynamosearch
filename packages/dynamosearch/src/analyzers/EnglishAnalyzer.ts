import StandardTokenizer from '../tokenizers/StandardTokenizer.js';
import EnglishPossessiveFilter from '../filters/EnglishPossessiveFilter.js';
import LowerCaseFilter from '../filters/LowerCaseFilter.js';
import StopFilter from '../filters/StopFilter.js';
import PorterStemFilter from '../filters/PorterStemFilter.js';
import Analyzer from './Analyzer.js';

class EnglishAnalyzer extends Analyzer {
  constructor() {
    super({
      tokenizer: new StandardTokenizer(),
      filters: [
        new EnglishPossessiveFilter(),
        new LowerCaseFilter(),
        new StopFilter({ stopWords: '_english_' }),
        new PorterStemFilter(),
      ],
    });
  }
}

export default EnglishAnalyzer;
