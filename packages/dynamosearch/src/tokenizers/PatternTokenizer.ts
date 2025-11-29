import Tokenizer from './Tokenizer.js';

export interface PatternTokenizerOptions {
  /** a regular expression. */
  pattern?: RegExp;
  /** Which capture group to extract as tokens. */
  group?: number;
}

class PatternTokenizer extends Tokenizer {
  private pattern: RegExp;
  private group: number;

  constructor({ pattern = /\W+/, group = -1 }: PatternTokenizerOptions = {}) {
    super();
    this.pattern = pattern.global && pattern.hasIndices ? pattern : new RegExp(pattern.source, pattern.flags + (pattern.global ? '' : 'g') + (pattern.hasIndices ? '' : 'd'));
    this.group = group;
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
    if (this.group === -1) {
      return this.splitPattern({ token: str, startOffset: 0, endOffset: str.length }, this.pattern).map((token, position) => ({ ...token, position }));
    }
    const matches = [...str.matchAll(this.pattern)];
    return matches.map((token, position) => ({
      token: token[this.group],
      startOffset: token.indices![this.group][0],
      endOffset: token.indices![this.group][1],
      position,
    }));
  }
}

export default PatternTokenizer;
