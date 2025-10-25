import type Tokenizer from '../tokenizers/Tokenizer.js';

type Filter = (tokens: { text: string }[]) => { text: string }[];

interface AnalyzerOptions {
  tokenizer: typeof Tokenizer;
  filters: Filter[];
}

class Analyzer {
  tokenizer: Tokenizer;
  filters: Filter[];

  constructor({ tokenizer, filters }: { tokenizer: Tokenizer; filters: Filter[] }) {
    this.tokenizer = tokenizer;
    this.filters = filters;
  }

  static async getInstance(options: AnalyzerOptions) {
    return new Analyzer({
      tokenizer: await options.tokenizer.getInstance(),
      filters: options.filters,
    });
  }

  analyze(str: string) {
    let tokens = this.tokenizer.tokenize(str);
    for (let i = 0; i < this.filters.length; i++) {
      tokens = this.filters[i](tokens);
    }
    return tokens;
  }
}

export default Analyzer;
