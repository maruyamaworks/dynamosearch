export interface KuromojiKatakanaStemFilterOptions {
  /** Katakana words shorter than the minimumLength are not stemmed. */
  minimumLength?: number;
}

const KuromojiKatakanaStemFilter = ({ minimumLength = 4 }: KuromojiKatakanaStemFilterOptions = {}) => (tokens: { text: string }[]) => {
  return tokens.map((item) => ({ ...item, text: item.text.length < minimumLength ? item.text : item.text.replace(/ー$/, '') }));
};

export default KuromojiKatakanaStemFilter;
