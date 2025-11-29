export interface Token {
  token: string;
  startOffset: number;
  endOffset: number;
  position: number;
  keyword?: boolean;
}

abstract class Tokenizer {
  abstract tokenize(str: string): Promise<Token[]>;
}

export default Tokenizer;
