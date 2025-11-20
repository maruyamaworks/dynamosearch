export interface LimitTokenCountFilterOptions {
  /** Maximum number of tokens to keep. Once this limit is reached, any remaining tokens are excluded from the output. */
  maxTokenCount?: number;
}

const LimitTokenCountFilter = ({ maxTokenCount = 1 }: LimitTokenCountFilterOptions = {}) => (tokens: { text: string }[]) => {
  return tokens.slice(0, maxTokenCount);
};

export default LimitTokenCountFilter;
