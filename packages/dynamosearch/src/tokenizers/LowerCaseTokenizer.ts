import Tokenizer from './Tokenizer.js';

class LowerCaseTokenizer extends Tokenizer {
  override async tokenize(str: string) {
    const matches = [...str.matchAll(/\p{L}+/gu)];
    return matches.map((token, position) => ({
      token: token[0].toLowerCase(),
      startOffset: token.index,
      endOffset: token.index + token[0].length,
      position,
    }));
  }
}

export default LowerCaseTokenizer;
