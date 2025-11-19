const kanaSet = new Set(['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゃ', 'ゅ', 'ょ', 'っ', 'ゎ']);

const KuromojiKatakanaUppercaseFilter = () => (tokens: { text: string }[]) => {
  return tokens.map((item) => ({ ...item, text: item.text.split('').map(char => kanaSet.has(char) ? String.fromCharCode(char.charCodeAt(0) + 1) : char).join('') }));
};

export default KuromojiKatakanaUppercaseFilter;
