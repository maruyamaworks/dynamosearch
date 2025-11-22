import Tokenizer from './Tokenizer.js';

export interface PatternTokenizerOptions {
  /** a regular expression. */
  pattern: RegExp;
  /** Which capture group to extract as tokens. */
  group: number;
}

class PatternTokenizer extends Tokenizer {
  pattern: RegExp;
  group: number;

  constructor({ pattern, group }: PatternTokenizerOptions) {
    super();
    this.pattern = pattern;
    this.group = group;
  }

  static override async getInstance(options?: Partial<PatternTokenizerOptions>) {
    return new PatternTokenizer({
      pattern: options?.pattern ?? /\W+/,
      group: options?.group ?? -1,
    });
  }

  tokenize(str: string) {
    if (this.group === -1) {
      return str.split(this.pattern).filter(Boolean).map(token => ({ text: token }));
    }
    const matches = [...str.matchAll(this.pattern)];
    return matches.map(token => ({ text: token[this.group] }));
  }
}

export default PatternTokenizer;
