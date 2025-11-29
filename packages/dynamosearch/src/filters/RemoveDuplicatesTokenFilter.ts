import UniqueFilter from './UniqueFilter.js';

class RemoveDuplicatesTokenFilter extends UniqueFilter {
  constructor() {
    super({ onlyOnSamePosition: true });
  }
}

export default RemoveDuplicatesTokenFilter;
