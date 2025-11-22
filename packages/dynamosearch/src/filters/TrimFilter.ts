const TrimFilter = () => (tokens: { text: string }[]) => {
  return tokens.map(token => ({ ...token, text: token.text.trim() }));
};

export default TrimFilter;
