import type Tokenizer from '../tokenizers/Tokenizer.js';
import type CharacterFilter from '../char_filters/CharacterFilter.js';
import type TokenFilter from '../filters/TokenFilter.js';

export interface AnalyzerOptions {
  tokenizer: Tokenizer;
  charFilters?: CharacterFilter[];
  filters?: TokenFilter[];
}

class Analyzer {
  tokenizer: Tokenizer;
  charFilters: CharacterFilter[];
  filters: TokenFilter[];

  constructor({ tokenizer, charFilters = [], filters = [] }: AnalyzerOptions) {
    this.tokenizer = tokenizer;
    this.charFilters = charFilters;
    this.filters = filters;
  }

  async analyze(str: string) {
    let text = str;
    for (let i = 0; i < this.charFilters.length; i++) {
      text = this.charFilters[i].apply(text);
    }
    let tokens = await this.tokenizer.tokenize(text);
    for (let i = 0; i < this.filters.length; i++) {
      tokens = this.filters[i].apply(tokens);
    }
    return tokens;
  }
}

export default Analyzer;
