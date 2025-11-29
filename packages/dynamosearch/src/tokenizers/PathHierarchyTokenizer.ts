import Tokenizer from './Tokenizer.js';

export interface PathHierarchyTokenizerOptions {
  delimiter?: string;
}

class PathHierarchyTokenizer extends Tokenizer {
  private delimiter: string;

  constructor({ delimiter = '/' }: PathHierarchyTokenizerOptions = {}) {
    super();
    this.delimiter = delimiter;
  }

  override async tokenize(str: string) {
    const segments = str.split(this.delimiter).slice(1);
    return new Array(segments.length).fill(0).map((_, i) => {
      const token = this.delimiter + segments.slice(0, i + 1).join(this.delimiter);
      return { token, startOffset: 0, endOffset: token.length, position: i };
    });
  }
}

export default PathHierarchyTokenizer;
