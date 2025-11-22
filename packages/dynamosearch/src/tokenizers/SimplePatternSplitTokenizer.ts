import Tokenizer from './Tokenizer.js';

export interface SimplePatternSplitTokenizerOptions {
  /** a regular expression to split the input into terms at pattern matches. */
  pattern?: RegExp;
}

class SimplePatternSplitTokenizer extends Tokenizer {
  private pattern: RegExp;

  constructor({ pattern = /^$/ }: SimplePatternSplitTokenizerOptions = {}) {
    super();
    this.pattern = pattern;
  }

  override async tokenize(str: string) {
    return str.split(this.pattern).filter(Boolean).map(token => ({ text: token }));
  }
}

export default SimplePatternSplitTokenizer;
