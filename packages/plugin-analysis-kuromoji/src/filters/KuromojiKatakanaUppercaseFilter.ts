const kanaSet = new Set(['ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ャ', 'ュ', 'ョ', 'ッ', 'ヮ', 'ヵ', 'ヶ']);

const KuromojiKatakanaUppercaseFilter = () => (tokens: { text: string }[]) => {
  return tokens.map((item) => ({ ...item, text: item.text.split('').map(char => kanaSet.has(char) ? String.fromCharCode(char.charCodeAt(0) + 1) : char).join('') }));
};

export default KuromojiKatakanaUppercaseFilter;
