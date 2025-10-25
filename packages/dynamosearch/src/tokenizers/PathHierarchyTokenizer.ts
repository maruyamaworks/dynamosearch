import Tokenizer from './Tokenizer.js';

export interface PathHierarchyTokenizerOptions {
  delimiter: string;
}

class PathHierarchyTokenizer extends Tokenizer {
  delimiter: string;

  constructor({ delimiter }: PathHierarchyTokenizerOptions) {
    super();
    this.delimiter = delimiter;
  }

  static async getInstance(options?: Partial<PathHierarchyTokenizerOptions>) {
    return new PathHierarchyTokenizer({
      delimiter: options?.delimiter ?? '/',
    });
  }

  tokenize(str: string) {
    const segments = str.split(this.delimiter).slice(1);
    return new Array(segments.length).fill(0).map((_, i) => ({
      text: this.delimiter + segments.slice(0, i + 1).join(this.delimiter),
    }));
  }
}

export default PathHierarchyTokenizer;
