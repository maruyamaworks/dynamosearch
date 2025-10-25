import type { IpadicFeatures } from 'kuromoji';

const KuromojiBaseFormFilter = () => (tokens: { text: string; metadata?: IpadicFeatures }[]) => {
  return tokens.map((item) => {
    if (!item.metadata) {
      return item;
    }
    return {
      ...item,
      text: item.metadata.basic_form ?? item.text,
    };
  });
};

export default KuromojiBaseFormFilter;
