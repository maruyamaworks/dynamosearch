abstract class TokenFilter {
  abstract apply(tokens: { text: string }[]): { text: string }[];
}

export default TokenFilter;
