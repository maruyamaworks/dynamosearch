import type Tokenizer from '../tokenizers/Tokenizer.js';

export type CharacterFilter = (str: string) => string;
export type TokenFilter = (tokens: { text: string }[]) => { text: string }[];

abstract class Analyzer {
  tokenizer: Tokenizer;
  charFilters: CharacterFilter[];
  filters: TokenFilter[];

  constructor({ tokenizer, charFilters, filters }: { tokenizer: Tokenizer; charFilters?: CharacterFilter[]; filters?: TokenFilter[] }) {
    this.tokenizer = tokenizer;
    this.charFilters = charFilters ?? [];
    this.filters = filters ?? [];
  }

  static async getInstance(): Promise<Analyzer> {
    throw new Error('Not implemented');
  }

  analyze(str: string) {
    let text = str;
    for (let i = 0; i < this.charFilters.length; i++) {
      text = this.charFilters[i](text);
    }
    let tokens = this.tokenizer.tokenize(text);
    for (let i = 0; i < this.filters.length; i++) {
      tokens = this.filters[i](tokens);
    }
    return tokens;
  }
}

export default Analyzer;
