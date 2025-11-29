import Tokenizer from './Tokenizer.js';

export interface StandardTokenizerOptions {
  /** The maximum token length. If a token is seen that exceeds this length then it is split at max_token_length intervals. */
  maxTokenLength?: number;
}

class StandardTokenizer extends Tokenizer {
  private maxTokenLength: number;

  constructor({ maxTokenLength = 255 }: StandardTokenizerOptions = {}) {
    super();
    this.maxTokenLength = maxTokenLength;
  }

  override async tokenize(str: string) {
    const tokens: { token: string; startOffset: number; endOffset: number }[] = [];
    const segments = [...str.matchAll(/[^-\s,.]+/g)];
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      for (let j = 0; j < segment[0].length; j += this.maxTokenLength) {
        tokens.push({
          token: segment[0].slice(j, j + this.maxTokenLength),
          startOffset: segment.index + j,
          endOffset: segment.index + Math.min(segment[0].length, j + this.maxTokenLength),
        });
      }
    }
    return tokens.map((token, position) => ({ ...token, position }));
  }
}

export default StandardTokenizer;
