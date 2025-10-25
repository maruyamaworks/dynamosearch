import { fileURLToPath } from 'node:url';
import kuromoji, { type IpadicFeatures, type Tokenizer, type TokenizerBuilderOption } from 'kuromoji';

class KuromojiTokenizer {
  tokenizer: Tokenizer<IpadicFeatures>;

  constructor({ tokenizer }: { tokenizer: Tokenizer<IpadicFeatures> }) {
    this.tokenizer = tokenizer;
  }

  static async getInstance(options?: Partial<TokenizerBuilderOption>) {
    return new Promise<KuromojiTokenizer>((resolve, reject) => {
      const builder = kuromoji.builder({
        dicPath: fileURLToPath(import.meta.resolve(options?.dicPath ?? '../../../../node_modules/kuromoji/dict')),
      });
      builder.build((err, tokenizer) => {
        if (err) {
          reject(err);
        } else {
          resolve(new KuromojiTokenizer({ tokenizer }));
        }
      });
    });
  }

  tokenize(str: string) {
    const tokens = this.tokenizer.tokenize(str);
    return tokens.map(token => ({
      text: token.surface_form,
      metadata: token,
    }));
  }
}

export default KuromojiTokenizer;
