import Tokenizer from './Tokenizer.js';

class LetterTokenizer extends Tokenizer {
  static override async getInstance() {
    return new LetterTokenizer();
  }

  tokenize(str: string) {
    const matches = str.match(/\p{L}+/gu);
    return matches?.map(token => ({ text: token })) ?? [];
  }
}

export default LetterTokenizer;
