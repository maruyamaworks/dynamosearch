import { PorterStemmer } from './snowball/index.js';

const PorterStemFilter = () => {
  const stemmer = new PorterStemmer();
  return (tokens: { text: string }[]) => tokens.map(token => ({ ...token, text: stemmer.stemWord(token.text) }));
};

export default PorterStemFilter;
