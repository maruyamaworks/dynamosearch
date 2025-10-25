abstract class Tokenizer {
  static async getInstance() {
    return {} as any;
  }

  abstract tokenize(str: string): { text: string }[];
}

export default Tokenizer;
