const UpperCaseFilter = () => (tokens: { text: string }[]) => {
  return tokens.map(token => ({ ...token, text: token.text.toUpperCase() }));
};

export default UpperCaseFilter;
