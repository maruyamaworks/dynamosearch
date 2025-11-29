import Tokenizer from './Tokenizer.js';

export interface SimplePatternSplitTokenizerOptions {
  /** a regular expression to split the input into terms at pattern matches. */
  pattern?: RegExp;
}

class SimplePatternSplitTokenizer extends Tokenizer {
  private pattern: RegExp;

  constructor({ pattern = /(?:)/ }: SimplePatternSplitTokenizerOptions = {}) {
    super();
    this.pattern = pattern.global ? pattern : new RegExp(pattern.source, pattern.flags + 'g');
  }

  private splitPattern(token: { token: string; startOffset: number; endOffset: number }, pattern: RegExp) {
    const matches = [...token.token.matchAll(pattern)];
    if (matches.length === 0) {
      return [{ ...token }];
    }
    const result = [{
      token: token.token.slice(0, matches[0].index),
      startOffset: token.startOffset,
      endOffset: token.startOffset + matches[0].index,
    }];
    for (let i = 0; i < matches.length; i++) {
      result.push({
        token: token.token.slice(matches[i].index + matches[i][0].length, i + 1 < matches.length ? matches[i + 1].index : token.token.length),
        startOffset: token.startOffset + matches[i].index + matches[i][0].length,
        endOffset: token.startOffset + (i + 1 < matches.length ? matches[i + 1].index : token.token.length),
      });
    }
    return result.filter(({ token }) => !!token);
  }

  override async tokenize(str: string) {
    return this.splitPattern({ token: str, startOffset: 0, endOffset: str.length }, this.pattern).map((token, position) => ({ ...token, position }));
  }
}

export default SimplePatternSplitTokenizer;
