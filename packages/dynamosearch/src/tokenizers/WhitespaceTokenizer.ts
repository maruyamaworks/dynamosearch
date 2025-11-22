import Tokenizer from './Tokenizer.js';

export interface WhitespaceTokenizerOptions {
  /** The maximum token length. If a token is seen that exceeds this length then it is split at max_token_length intervals. */
  maxTokenLength?: number;
}

class WhitespaceTokenizer extends Tokenizer {
  private maxTokenLength: number;

  constructor({ maxTokenLength = 255 }: WhitespaceTokenizerOptions = {}) {
    super();
    this.maxTokenLength = maxTokenLength;
  }

  override async tokenize(str: string) {
    const tokens: string[] = [];
    const segments = str.split(/\s+/).filter(Boolean);
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      for (let j = 0; j < segment.length; j += this.maxTokenLength) {
        tokens.push(segment.slice(j, j + this.maxTokenLength));
      }
    }
    return tokens.map(token => ({ text: token }));
  }
}

export default WhitespaceTokenizer;
