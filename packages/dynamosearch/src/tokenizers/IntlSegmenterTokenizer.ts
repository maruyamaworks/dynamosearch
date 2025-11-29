import Tokenizer from './Tokenizer.js';

export interface IntlSegmenterTokenizerOptions {
  /**
   * A string with a BCP 47 language tag or an `Intl.Locale` instance, or an array of such locale identifiers.
   * The runtime's default locale is used when `undefined` is passed or when none of the specified locale identifiers is supported.
   * For the general form and interpretation of the `locales` argument, see the parameter description on the `Intl` main page.
   */
  locales?: Intl.LocalesArgument;
}

class IntlSegmenterTokenizer extends Tokenizer {
  private segmenter: Intl.Segmenter;

  constructor({ locales }: IntlSegmenterTokenizerOptions = {}) {
    super();
    this.segmenter = new Intl.Segmenter(locales, { granularity: 'word' });
  }

  override async tokenize(str: string) {
    const iterator = this.segmenter.segment(str);
    return [...iterator].filter(item => item.isWordLike).map((segment, position) => ({
      token: segment.segment,
      startOffset: segment.index,
      endOffset: segment.index + segment.segment.length,
      position,
    }));
  }
}

export default IntlSegmenterTokenizer;
