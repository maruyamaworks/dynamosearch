import { Token } from '../tokenizers/Tokenizer.js';

abstract class TokenFilter {
  abstract apply(tokens: Token[]): Token[];
}

export default TokenFilter;
export { Token };
