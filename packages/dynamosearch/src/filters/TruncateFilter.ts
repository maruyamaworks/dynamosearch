export interface TruncateFilterOptions {
  /** Character limit for each token. Tokens exceeding this limit are truncated. */
  length?: number;
}

const TruncateFilter = ({ length = 10 }: TruncateFilterOptions = {}) => (tokens: { text: string }[]) => {
  return tokens.map(token => ({ ...token, text: token.text.slice(0, length) }));
};

export default TruncateFilter;
