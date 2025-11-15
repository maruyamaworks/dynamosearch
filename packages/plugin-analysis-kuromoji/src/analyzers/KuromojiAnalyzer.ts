import Analyzer from 'dynamosearch/analyzers/Analyzer.js';
import CJKWidthFilter from 'dynamosearch/filters/CJKWidthFilter.js';
import LowerCaseFilter from 'dynamosearch/filters/LowerCaseFilter.js';
import ICUNormalizer from 'dynamosearch/char_filters/ICUNormalizer.js';
import KuromojiTokenizer from '../tokenizers/KuromojiTokenizer.js';
import KuromojiBaseFormFilter from '../filters/KuromojiBaseFormFilter.js';
import KuromojiPartOfSpeechStopFilter from '../filters/KuromojiPartOfSpeechStopFilter.js';
import KuromojiKatakanaStemFilter from '../filters/KuromojiKatakanaStemFilter.js';
import JapaneseStopFilter from '../filters/JapaneseStopFilter.js';

class KuromojiAnalyzer extends Analyzer {
  static override async getInstance() {
    return new KuromojiAnalyzer({
      charFilters: [
        ICUNormalizer(),
      ],
      tokenizer: await KuromojiTokenizer.getInstance(),
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
