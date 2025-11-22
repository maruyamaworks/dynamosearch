import Tokenizer from './Tokenizer.js';

class LetterTokenizer extends Tokenizer {
  override async tokenize(str: string) {
    const matches = str.match(/\p{L}+/gu);
    return matches?.map(token => ({ text: token })) ?? [];
  }
}

export default LetterTokenizer;
