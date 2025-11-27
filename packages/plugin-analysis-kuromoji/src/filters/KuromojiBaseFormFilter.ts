import TokenFilter from 'dynamosearch/filters/TokenFilter';
import type { IpadicFeatures } from 'kuromoji';

class KuromojiBaseFormFilter extends TokenFilter {
  override apply(tokens: { text: string; metadata?: IpadicFeatures }[]) {
    return tokens.map((item) => {
      if (!item.metadata?.basic_form || item.metadata.basic_form === '*') {
        return item;
      }
      return { ...item, text: item.metadata.basic_form };
    });
  }
}

export default KuromojiBaseFormFilter;
