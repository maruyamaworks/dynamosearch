import Analyzer from 'dynamosearch/analyzers/Analyzer.js';
import CJKWidthFilter from 'dynamosearch/filters/CJKWidthFilter.js';
import KuromojiTokenizer from '../tokenizers/KuromojiTokenizer.js';
import KuromojiBaseFormFilter from '../filters/KuromojiBaseFormFilter.js';
import KuromojiPartOfSpeechStopFilter from '../filters/KuromojiPartOfSpeechStopFilter.js';
import KuromojiKatakanaStemFilter from '../filters/KuromojiKatakanaStemFilter.js';
import JapaneseStopFilter from '../filters/JapaneseStopFilter.js';

class KuromojiAnalyzer extends Analyzer {
  static async getInstance() {
    return new KuromojiAnalyzer({
      tokenizer: await KuromojiTokenizer.getInstance(),
      filters: [
        KuromojiBaseFormFilter(),
        KuromojiPartOfSpeechStopFilter(),
        CJKWidthFilter(),
        JapaneseStopFilter(),
        KuromojiKatakanaStemFilter(),
      ],
    });
  }
}

export default KuromojiAnalyzer;
