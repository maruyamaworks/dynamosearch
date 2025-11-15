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
  segmenter: Intl.Segmenter;

  constructor({ segmenter }: { segmenter: Intl.Segmenter }) {
    super();
    this.segmenter = segmenter;
  }

  static override async getInstance(options?: Partial<IntlSegmenterTokenizerOptions>) {
    return new IntlSegmenterTokenizer({
      segmenter: new Intl.Segmenter(options?.locales, { granularity: 'word' }),
    });
  }

  tokenize(str: string) {
    const iterator = this.segmenter.segment(str);
    return [...iterator].filter(item => item.isWordLike).map(segment => ({ text: segment.segment }));
  }
}

export default IntlSegmenterTokenizer;
