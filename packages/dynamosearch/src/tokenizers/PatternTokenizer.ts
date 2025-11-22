import Tokenizer from './Tokenizer.js';

export interface PatternTokenizerOptions {
  /** a regular expression. */
  pattern?: RegExp;
  /** Which capture group to extract as tokens. */
  group?: number;
}

class PatternTokenizer extends Tokenizer {
  private pattern: RegExp;
  private group: number;

  constructor({ pattern = /\W+/, group = -1 }: PatternTokenizerOptions = {}) {
    super();
    this.pattern = pattern;
    this.group = group;
  }

  override async tokenize(str: string) {
    if (this.group === -1) {
      return str.split(this.pattern).filter(Boolean).map(token => ({ text: token }));
    }
    const matches = [...str.matchAll(this.pattern)];
    return matches.map(token => ({ text: token[this.group] }));
  }
}

export default PatternTokenizer;
