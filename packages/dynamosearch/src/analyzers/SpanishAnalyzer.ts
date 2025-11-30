import StandardTokenizer from '../tokenizers/StandardTokenizer.js';
import LowerCaseFilter from '../filters/LowerCaseFilter.js';
import StopFilter from '../filters/StopFilter.js';
import SnowballFilter from '../filters/SnowballFilter.js';
import Analyzer from './Analyzer.js';

class SpanishAnalyzer extends Analyzer {
  constructor() {
    super({
      tokenizer: new StandardTokenizer(),
      filters: [
        new LowerCaseFilter(),
        new StopFilter({ stopWords: '_spanish_' }),
        new SnowballFilter({ language: 'Spanish' }),
      ],
    });
  }
}

export default SpanishAnalyzer;
