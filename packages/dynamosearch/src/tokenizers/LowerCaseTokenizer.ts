import Tokenizer from './Tokenizer.js';

class LowerCaseTokenizer extends Tokenizer {
  override async tokenize(str: string) {
    const matches = str.match(/\p{L}+/gu);
    return matches?.map(token => ({ text: token.toLowerCase() })) ?? [];
  }
}

export default LowerCaseTokenizer;
