import TokenFilter from './TokenFilter.js';
import * as Snowball from './snowball/index.js';

export interface SnowballFilterOptions {
  language?: keyof typeof Snowball extends `${infer L}Stemmer` ? L : never;
}

class SnowballFilter extends TokenFilter {
  private stemmer: any;

  constructor({ language = 'English' }: SnowballFilterOptions = {}) {
    super();
    this.stemmer = new Snowball[`${language}Stemmer`]();
  }

  override apply(tokens: { text: string }[]) {
    return tokens.map(token => ({ ...token, text: this.stemmer.stemWord(token.text) }));
  }
}

export default SnowballFilter;
