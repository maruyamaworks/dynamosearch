import Tokenizer from './Tokenizer.js';

export interface NGramTokenizerOptions {
  minGram: number;
  maxGram: number;
}

class NGramTokenizer extends Tokenizer {
  minGram: number;
  maxGram: number;

  constructor({ minGram, maxGram }: NGramTokenizerOptions) {
    super();
    this.minGram = minGram;
    this.maxGram = maxGram;
  }

  static override async getInstance(options?: Partial<NGramTokenizerOptions>) {
    return new NGramTokenizer({
      minGram: options?.minGram ?? 1,
      maxGram: options?.maxGram ?? 2,
    });
  }

  tokenize(str: string) {
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
