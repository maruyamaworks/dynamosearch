import Tokenizer from './Tokenizer.js';

export interface SimplePatternTokenizerOptions {
  /** a regular expression to capture matching text as terms. */
  pattern: RegExp;
}

class SimplePatternTokenizer extends Tokenizer {
  pattern: RegExp;

  constructor({ pattern }: SimplePatternTokenizerOptions) {
    super();
    this.pattern = pattern;
  }

  static override async getInstance(options?: Partial<SimplePatternTokenizerOptions>) {
    return new SimplePatternTokenizer({
      pattern: options?.pattern ?? /^$/,
    });
  }

  tokenize(str: string) {
    const matches = str.match(this.pattern);
    if (!matches) {
      return [];
    }
    return matches.map(token => ({ text: token }));
  }
}

export default SimplePatternTokenizer;
