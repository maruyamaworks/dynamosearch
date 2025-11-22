abstract class Tokenizer {
  abstract tokenize(str: string): Promise<{ text: string }[]>;
}

export default Tokenizer;
