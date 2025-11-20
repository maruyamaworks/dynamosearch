import Tokenizer from './Tokenizer.js';

class LowerCaseTokenizer extends Tokenizer {
  static override async getInstance() {
    return new LowerCaseTokenizer();
  }

  tokenize(str: string) {
    const matches = str.match(/\p{L}+/gu);
    return matches?.map(token => ({ text: token.toLowerCase() })) ?? [];
  }
}

export default LowerCaseTokenizer;
