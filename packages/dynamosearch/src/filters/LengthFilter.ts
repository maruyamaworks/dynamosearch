export interface LengthFilterOptions {
  /** Minimum character length of a token. Shorter tokens are excluded from the output. */
  min?: number;
  /** Maximum character length of a token. Longer tokens are excluded from the output. */
  max?: number;
}

const LengthFilter = ({ min = 0, max = 2147483647 }: LengthFilterOptions = {}) => (tokens: { text: string }[]) => {
  return tokens.filter(token => token.text.length >= min && token.text.length <= max);
};

export default LengthFilter;
