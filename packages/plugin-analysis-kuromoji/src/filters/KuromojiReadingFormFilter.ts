import type { IpadicFeatures } from 'kuromoji';

export interface KuromojiReadingFormFilterOptions {
  /** Whether romaji reading form should be output instead of katakana. */
  useRomaji?: boolean;
}

const KuromojiReadingFormFilter = ({ useRomaji = false }: KuromojiReadingFormFilterOptions = {}) => (tokens: { text: string; metadata?: IpadicFeatures }[]) => {
  if (useRomaji) {
    throw new Error('Romaji reading form is not supported yet.');
  }
  return tokens.map((item) => {
    if (!item.metadata?.reading || item.metadata.reading === '*') {
      return item;
    }
    return { ...item, text: item.metadata.reading };
  });
};

export default KuromojiReadingFormFilter;
