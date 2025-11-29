import Tokenizer from './Tokenizer.js';

export interface SimplePatternTokenizerOptions {
  /** a regular expression to capture matching text as terms. */
  pattern?: RegExp;
}

class SimplePatternTokenizer extends Tokenizer {
  private pattern: RegExp;

  constructor({ pattern = /^$/ }: SimplePatternTokenizerOptions = {}) {
    super();
    this.pattern = pattern.global ? pattern : new RegExp(pattern.source, pattern.flags + 'g');
  }

  override async tokenize(str: string) {
    const matches = [...str.matchAll(this.pattern)];
    return matches.map((token, position) => ({
      token: token[0],
      startOffset: token.index,
      endOffset: token.index + token[0].length,
      position,
    }));
  }
}

export default SimplePatternTokenizer;
