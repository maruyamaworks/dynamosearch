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

  private splitPattern(token: { token: string; startOffset: number; endOffset: number }, pattern: RegExp) {
    const matches = [...token.token.matchAll(pattern)];
    if (matches.length === 0) {
      return [{ ...token, keyword: false }];
    }
    const result = [{
      token: token.token.slice(0, matches[0].index),
      startOffset: token.startOffset,
      endOffset: token.startOffset + matches[0].index,
      keyword: false,
    }];
    for (let i = 0; i < matches.length; i++) {
      result.push({
        token: token.token.slice(matches[i].index, matches[i].index + matches[i][0].length),
        startOffset: token.startOffset + matches[i].index,
        endOffset: token.startOffset + matches[i].index + matches[i][0].length,
        keyword: matches[i][0].length <= this.maxTokenLength,
      });
      result.push({
        token: token.token.slice(matches[i].index + matches[i][0].length, i + 1 < matches.length ? matches[i + 1].index : token.token.length),
        startOffset: token.startOffset + matches[i].index + matches[i][0].length,
        endOffset: token.startOffset + (i + 1 < matches.length ? matches[i + 1].index : token.token.length),
        keyword: false,
      });
    }
    return result.filter(({ token }) => !!token);
  }

  override async tokenize(str: string) {
    const tokens: { token: string; startOffset: number; endOffset: number; keyword: boolean }[] = [];
    const segments = this.splitPattern({ token: str, startOffset: 0, endOffset: str.length }, URLEmailTokenizer.URL_PATTERN)
      .flatMap(segment => segment.keyword ? [segment] : this.splitPattern(segment, URLEmailTokenizer.EMAIL_PATTERN))
      .flatMap(segment => segment.keyword ? [segment] : this.splitPattern(segment, /[-\s,.]+/g).filter(token => !token.keyword));
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      for (let j = 0; j < segment.token.length; j += this.maxTokenLength) {
        tokens.push({
          token: segment.token.slice(j, j + this.maxTokenLength),
          startOffset: segment.startOffset + j,
          endOffset: segment.startOffset + Math.min(segment.token.length, j + this.maxTokenLength),
          keyword: segment.keyword,
        });
      }
    }
    return tokens.map((token, position) => ({ ...token, position }));
  }
}

export default URLEmailTokenizer;
