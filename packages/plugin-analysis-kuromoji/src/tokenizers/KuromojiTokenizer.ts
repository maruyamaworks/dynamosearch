import { fileURLToPath } from 'node:url';
import Tokenizer from 'dynamosearch/tokenizers/Tokenizer';
import kuromoji, { type IpadicFeatures, type TokenizerBuilderOption } from 'kuromoji';

export interface KuromojiTokenizerOptions extends TokenizerBuilderOption {
  discardPunctuation?: boolean;
}

const isPunctuation = (str: string) => {
  // https://github.com/apache/lucene/blob/6c5d3299967fc905a6b6c54586289153c1c53e66/lucene/analysis/kuromoji/src/java/org/apache/lucene/analysis/ja/ViterbiNBest.java#L705
  return /^(\p{Zs}|\p{Zl}|\p{Zp}|\p{Cc}|\p{Cf}|\p{Pd}|\p{Ps}|\p{Pe}|\p{Pc}|\p{Po}|\p{Sm}|\p{Sc}|\p{Sk}|\p{So}|\p{Pi}|\p{Pf})*$/u.test(str);
};

class KuromojiTokenizer extends Tokenizer {
  private discardPunctuation: boolean;
  private dicPath: string;
  private tokenizerPromise?: Promise<kuromoji.Tokenizer<IpadicFeatures>>;

  constructor({ discardPunctuation = true, dicPath = 'kuromoji/dict' }: KuromojiTokenizerOptions = {}) {
    super();
    this.discardPunctuation = discardPunctuation;
    this.dicPath = dicPath;
  }

  private async createTokenizer(dicPath: string) {
    return new Promise<kuromoji.Tokenizer<IpadicFeatures>>((resolve, reject) => {
      const builder = kuromoji.builder({
        dicPath: fileURLToPath(import.meta.resolve(dicPath)),
      });
      builder.build((err, tokenizer) => {
        if (err) {
          reject(err);
        } else {
          resolve(tokenizer);
        }
      });
    });
  }

  override async tokenize(str: string) {
    if (!this.tokenizerPromise) {
      this.tokenizerPromise = this.createTokenizer(this.dicPath);
    }
    const tokens = (await this.tokenizerPromise).tokenize(str);
    return tokens.filter(token => !(this.discardPunctuation && isPunctuation(token.surface_form))).map(token => ({
      text: token.surface_form,
      metadata: token,
    }));
  }
}

export default KuromojiTokenizer;
