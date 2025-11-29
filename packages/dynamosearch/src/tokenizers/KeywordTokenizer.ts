import Tokenizer from './Tokenizer.js';

class KeywordTokenizer extends Tokenizer {
  override async tokenize(str: string) {
    return [{
      token: str,
      startOffset: 0,
      endOffset: str.length,
      position: 0,
    }];
  }
}

export default KeywordTokenizer;
