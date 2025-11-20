import { fileURLToPath } from 'node:url';
import Tokenizer from 'dynamosearch/tokenizers/Tokenizer.js';
import kuromoji, { type IpadicFeatures, type TokenizerBuilderOption } from 'kuromoji';

export interface KuromojiTokenizerOptions extends TokenizerBuilderOption {
  discardPunctuation: boolean;
}

const isPunctuation = (str: string) => {
  // https://github.com/apache/lucene/blob/6c5d3299967fc905a6b6c54586289153c1c53e66/lucene/analysis/kuromoji/src/java/org/apache/lucene/analysis/ja/ViterbiNBest.java#L705
  return /^(\p{Zs}|\p{Zl}|\p{Zp}|\p{Cc}|\p{Cf}|\p{Pd}|\p{Ps}|\p{Pe}|\p{Pc}|\p{Po}|\p{Sm}|\p{Sc}|\p{Sk}|\p{So}|\p{Pi}|\p{Pf})*$/u.test(str);
};

class KuromojiTokenizer extends Tokenizer {
  discardPunctuation: boolean;
  tokenizer: kuromoji.Tokenizer<IpadicFeatures>;

  constructor({ discardPunctuation, tokenizer }: { discardPunctuation: boolean; tokenizer: kuromoji.Tokenizer<IpadicFeatures> }) {
    super();
    this.discardPunctuation = discardPunctuation;
    this.tokenizer = tokenizer;
  }

  static override async getInstance(options?: Partial<KuromojiTokenizerOptions>) {
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
