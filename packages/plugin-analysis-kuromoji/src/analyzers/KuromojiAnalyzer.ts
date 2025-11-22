import Analyzer from 'dynamosearch/analyzers/Analyzer';
import CJKWidthFilter from 'dynamosearch/filters/CJKWidthFilter';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter';
import ICUNormalizer from 'dynamosearch/char_filters/ICUNormalizer';
import KuromojiTokenizer from '../tokenizers/KuromojiTokenizer.js';
import KuromojiBaseFormFilter from '../filters/KuromojiBaseFormFilter.js';
import KuromojiPartOfSpeechStopFilter from '../filters/KuromojiPartOfSpeechStopFilter.js';
import KuromojiKatakanaStemFilter from '../filters/KuromojiKatakanaStemFilter.js';
import JapaneseStopFilter from '../filters/JapaneseStopFilter.js';

class KuromojiAnalyzer extends Analyzer {
  constructor() {
    super({
      charFilters: [
        ICUNormalizer(),
      ],
      tokenizer: new KuromojiTokenizer(),
      filters: [
        KuromojiBaseFormFilter(),
        KuromojiPartOfSpeechStopFilter(),
        CJKWidthFilter(),
        JapaneseStopFilter(),
        KuromojiKatakanaStemFilter(),
        LowerCaseFilter(),
      ],
    });
  }
}

export default KuromojiAnalyzer;
