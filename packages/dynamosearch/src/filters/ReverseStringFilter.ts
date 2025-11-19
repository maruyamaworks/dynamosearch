const ReverseStringFilter = () => (tokens: { text: string }[]) => {
  return tokens.map(token => ({ ...token, text: token.text.split('').reverse().join('') }));
};

export default ReverseStringFilter;
