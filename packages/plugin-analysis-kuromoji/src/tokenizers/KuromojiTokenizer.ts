import { fileURLToPath } from 'node:url';
import kuromoji, { type IpadicFeatures, type Tokenizer, type TokenizerBuilderOption } from 'kuromoji';

export interface KuromojiTokenizerOptions extends TokenizerBuilderOption {
  discardPunctuation: boolean;
}

const isPunctuation = (str: string) => {
  /**
   * TODO: Checks should be performed using Unicode's General Category, like the original implementation of the Apache Lucene.
   * https://github.com/apache/lucene/blob/main/lucene/analysis/kuromoji/src/java/org/apache/lucene/analysis/ja/ViterbiNBest.java
   */
  return /^[-_=+~!@#$%^&*(){}[\]|\\:;"'`<>,.?/\s]*$/.test(str);
};

class KuromojiTokenizer {
  discardPunctuation: boolean;
  tokenizer: Tokenizer<IpadicFeatures>;

  constructor({ discardPunctuation, tokenizer }: { discardPunctuation: boolean; tokenizer: Tokenizer<IpadicFeatures> }) {
    this.discardPunctuation = discardPunctuation;
    this.tokenizer = tokenizer;
  }

  static async getInstance(options?: Partial<KuromojiTokenizerOptions>) {
    return new Promise<KuromojiTokenizer>((resolve, reject) => {
      const builder = kuromoji.builder({
        dicPath: fileURLToPath(import.meta.resolve(options?.dicPath ?? 'kuromoji/dict')),
      });
      builder.build((err, tokenizer) => {
        if (err) {
          reject(err);
        } else {
          resolve(new KuromojiTokenizer({
            discardPunctuation: options?.discardPunctuation ?? true,
            tokenizer,
          }));
        }
      });
    });
  }

  tokenize(str: string) {
    const tokens = this.tokenizer.tokenize(str);
    return tokens.filter(token => !(this.discardPunctuation && isPunctuation(token.surface_form))).map(token => ({
      text: token.surface_form,
      metadata: token,
    }));
  }
}

export default KuromojiTokenizer;
