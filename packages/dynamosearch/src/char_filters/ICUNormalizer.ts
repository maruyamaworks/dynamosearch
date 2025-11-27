import CharacterFilter from './CharacterFilter.js';

export interface ICUNormalizerOptions {
  name?: 'nfc' | 'nfkc';
  mode?: 'compose' | 'decompose';
}

class ICUNormalizer extends CharacterFilter {
  private name: 'nfc' | 'nfkc';
  private mode: 'compose' | 'decompose';

  constructor({ name = 'nfkc', mode = 'compose' }: ICUNormalizerOptions = {}) {
    super();
    this.name = name;
    this.mode = mode;
  }

  override apply(str: string) {
    const form = this.name === 'nfc' ? (this.mode === 'compose' ? 'NFC' : 'NFD') : (this.mode === 'compose' ? 'NFKC' : 'NFKD');
    return str.normalize(form);
  }
}

export default ICUNormalizer;
