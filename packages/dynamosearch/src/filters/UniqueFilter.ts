import TokenFilter, { type Token } from './TokenFilter.js';

export interface UniqueFilterOptions {
  /** If true, only remove duplicate tokens in the same position. */
  onlyOnSamePosition?: boolean;
}

class UniqueFilter extends TokenFilter {
  private onlyOnSamePosition: boolean;

  constructor({ onlyOnSamePosition = false }: UniqueFilterOptions = {}) {
    super();
    this.onlyOnSamePosition = onlyOnSamePosition;
  }

  override apply(tokens: Token[]) {
    const result: Token[] = [];
    for (let i = 0; i < tokens.length; i++){
      if (result.every(({ token, position }) => token !== tokens[i].token || (this.onlyOnSamePosition && position !== tokens[i].position))) {
        result.push(tokens[i]);
      }
    }
    return result;
  }
}

export default UniqueFilter;
