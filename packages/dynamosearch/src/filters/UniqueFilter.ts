const UniqueFilter = () => (tokens: { text: string }[]) => {
  return [...new Set(tokens.map(token => token.text))].map(text => ({ text }));
};

export default UniqueFilter;
