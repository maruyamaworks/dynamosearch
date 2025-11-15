abstract class Tokenizer {
  static async getInstance(): Promise<Tokenizer> {
    throw new Error('Not implemented');
  }

  abstract tokenize(str: string): { text: string }[];
}

export default Tokenizer;
