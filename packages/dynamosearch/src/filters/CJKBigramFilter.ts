import TokenFilter, { type Token } from './TokenFilter.js';

export interface CJKBigramFilterOptions {
  /**
   * If true, emit tokens in both bigram and unigram form.
   * If false, a CJK character is output in unigram form when it has no adjacent characters.
   */
  outputUnigrams?: boolean;
}

class CJKBigramFilter extends TokenFilter {
  private outputUnigrams: boolean;

  constructor({ outputUnigrams = false }: CJKBigramFilterOptions = {}) {
    super();
    this.outputUnigrams = outputUnigrams;
  }

  override apply(tokens: Token[]) {
    const result: Token[] = [];
    for (let i = 0; i < tokens.length; i++) {
      if (this.outputUnigrams || (
        (i === 0 || tokens[i - 1].endOffset !== tokens[i].startOffset) &&
        (i === tokens.length - 1 || tokens[i].endOffset !== tokens[i + 1].startOffset)
      )) {
        result.push(tokens[i]);
      }
      if (i < tokens.length - 1 && tokens[i].endOffset === tokens[i + 1].startOffset) {
        result.push({
          token: tokens[i].token + tokens[i + 1].token,
          startOffset: tokens[i].startOffset,
          endOffset: tokens[i + 1].endOffset,
          position: tokens[i].position,
        });
      }
    }
    return result;
  }
}

export default CJKBigramFilter;
