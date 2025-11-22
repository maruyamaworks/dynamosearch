import Tokenizer from './Tokenizer.js';

class KeywordTokenizer extends Tokenizer {
  override async tokenize(str: string) {
    return [{ text: str }];
  }
}

export default KeywordTokenizer;
