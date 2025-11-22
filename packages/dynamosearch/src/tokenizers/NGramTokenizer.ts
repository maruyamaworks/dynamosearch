import Tokenizer from './Tokenizer.js';

export interface NGramTokenizerOptions {
  minGram?: number;
  maxGram?: number;
}

class NGramTokenizer extends Tokenizer {
  private minGram: number;
  private maxGram: number;

  constructor({ minGram = 1, maxGram = 2 }: NGramTokenizerOptions = {}) {
    super();
    this.minGram = minGram;
    this.maxGram = maxGram;
  }

  override async tokenize(str: string) {
    const tokens: string[] = [];
    for (let i = 0; i < str.length; i++) {
      for (let j = this.minGram; j <= this.maxGram && i + j <= str.length; j++) {
        tokens.push(str.slice(i, i + j));
      }
    }
    return tokens.map(token => ({ text: token }));
  }
}

export default NGramTokenizer;
