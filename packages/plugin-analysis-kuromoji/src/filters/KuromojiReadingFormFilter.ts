import TokenFilter from 'dynamosearch/filters/TokenFilter';
import type { IpadicFeatures } from 'kuromoji';

export interface KuromojiReadingFormFilterOptions {
  /** Whether romaji reading form should be output instead of katakana. */
  useRomaji?: boolean;
}

class KuromojiReadingFormFilter extends TokenFilter {
  private useRomaji: boolean;

  constructor({ useRomaji = false }: KuromojiReadingFormFilterOptions = {}) {
    super();
    this.useRomaji = useRomaji;
  }

  override apply(tokens: { text: string; metadata?: IpadicFeatures }[]) {
    if (this.useRomaji) {
      throw new Error('Romaji reading form is not supported yet.');
    }
    return tokens.map((item) => {
      if (!item.metadata?.reading || item.metadata.reading === '*') {
        return item;
      }
      return { ...item, text: item.metadata.reading };
    });
  }
}

export default KuromojiReadingFormFilter;
