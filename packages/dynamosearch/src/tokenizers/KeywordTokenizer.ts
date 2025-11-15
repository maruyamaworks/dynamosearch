import Tokenizer from './Tokenizer.js';

class KeywordTokenizer extends Tokenizer {
  constructor() {
    super();
  }

  static override async getInstance() {
    return new KeywordTokenizer();
  }

  tokenize(str: string) {
    return [{ text: str }];
  }
}

export default KeywordTokenizer;
