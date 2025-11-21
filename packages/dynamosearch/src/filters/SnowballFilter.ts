import * as Snowball from './snowball/index.js';

export interface SnowballFilterOptions {
  language?: keyof typeof Snowball extends `${infer L}Stemmer` ? L : never;
}

const SnowballFilter = ({ language = 'English' }: SnowballFilterOptions = {}) => {
  const stemmer = new Snowball[`${language}Stemmer`]();
  return (tokens: { text: string }[]) => tokens.map(token => ({ ...token, text: stemmer.stemWord(token.text) }));
};

export default SnowballFilter;
