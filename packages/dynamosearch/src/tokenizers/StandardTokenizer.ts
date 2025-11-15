import Tokenizer from './Tokenizer.js';

export interface StandardTokenizerOptions {
  /** The maximum token length. If a token is seen that exceeds this length then it is split at max_token_length intervals. */
  maxTokenLength: number;
}

class StandardTokenizer extends Tokenizer {
  maxTokenLength: number;

  constructor({ maxTokenLength }: StandardTokenizerOptions) {
    super();
    this.maxTokenLength = maxTokenLength;
  }

  static override async getInstance(options?: Partial<StandardTokenizerOptions>) {
    return new StandardTokenizer({
      maxTokenLength: options?.maxTokenLength ?? 255,
    });
  }

  tokenize(str: string) {
    const tokens: string[] = [];
    const segments = str.split(/[-\s,.]+/).filter(Boolean);
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      for (let j = 0; j < segment.length; j += this.maxTokenLength) {
        tokens.push(segment.slice(j, j + this.maxTokenLength));
      }
    }
    return tokens.map(token => ({ text: token }));
  }
}

export default StandardTokenizer;
