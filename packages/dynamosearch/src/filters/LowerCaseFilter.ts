const LowerCaseFilter = () => (tokens: { text: string }[]) => {
  return tokens.map(token => ({ ...token, text: token.text.toLowerCase() }));
};

export default LowerCaseFilter;
