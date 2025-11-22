import Tokenizer from './Tokenizer.js';

export interface URLEmailTokenizerOptions {
  /** The maximum token length. If a token is seen that exceeds this length then it is split at max_token_length intervals. */
  maxTokenLength?: number;
}

class URLEmailTokenizer extends Tokenizer {
  private maxTokenLength: number;

  static readonly URL_PATTERN = /https?:\/\/[\w/:%#$&?()~.=+-]+/g;

  /**
   * @see https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
   */
  static readonly EMAIL_PATTERN = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/g;

  constructor({ maxTokenLength = 255 }: URLEmailTokenizerOptions = {}) {
    super();
    this.maxTokenLength = maxTokenLength;
  }

  private splitPattern(str: string, pattern: RegExp) {
    const matches = [...str.matchAll(pattern)];
    if (matches.length === 0) {
      return [{ text: str, matched: false }];
    }
    const result = [{ text: str.slice(0, matches[0].index), matched: false }];
    for (let i = 0; i < matches.length; i++) {
      result.push({ text: str.slice(matches[i].index, matches[i].index + matches[i][0].length), matched: matches[i][0].length <= this.maxTokenLength });
      result.push({ text: str.slice(matches[i].index + matches[i][0].length, i + 1 < matches.length ? matches[i + 1].index : str.length), matched: false });
    }
    return result.filter(({ text }) => text);
  }

  override async tokenize(str: string) {
    const tokens: string[] = [];
    const segments = this.splitPattern(str, URLEmailTokenizer.URL_PATTERN)
      .flatMap(segment => segment.matched ? [segment] : this.splitPattern(segment.text, URLEmailTokenizer.EMAIL_PATTERN))
      .flatMap(segment => segment.matched ? [segment] : segment.text.split(/[-\s,.]+/).map(text => ({ text })));
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      for (let j = 0; j < segment.text.length; j += this.maxTokenLength) {
        tokens.push(segment.text.slice(j, j + this.maxTokenLength));
      }
    }
    return tokens.map(token => ({ text: token }));
  }
}

export default URLEmailTokenizer;
