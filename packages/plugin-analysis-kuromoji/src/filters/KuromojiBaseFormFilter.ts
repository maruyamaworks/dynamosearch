import type { IpadicFeatures } from 'kuromoji';

const KuromojiBaseFormFilter = () => (tokens: { text: string; metadata?: IpadicFeatures }[]) => {
  return tokens.map((item) => {
    if (!item.metadata?.basic_form || item.metadata.basic_form === '*') {
      return item;
    }
    return { ...item, text: item.metadata.basic_form };
  });
};

export default KuromojiBaseFormFilter;
