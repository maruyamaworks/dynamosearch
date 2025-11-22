import Tokenizer from './Tokenizer.js';

export interface SimplePatternTokenizerOptions {
  /** a regular expression to capture matching text as terms. */
  pattern?: RegExp;
}

class SimplePatternTokenizer extends Tokenizer {
  private pattern: RegExp;

  constructor({ pattern = /^$/ }: SimplePatternTokenizerOptions = {}) {
    super();
    this.pattern = pattern;
  }

  override async tokenize(str: string) {
    const matches = [...str.matchAll(this.pattern)];
    return matches.map(token => ({ text: token[0] }));
  }
}

export default SimplePatternTokenizer;
