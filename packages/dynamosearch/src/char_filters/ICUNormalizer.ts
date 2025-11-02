export interface ICUNormalizerOptions {
  name?: 'nfc' | 'nfkc';
  mode?: 'compose' | 'decompose';
}

const ICUNormalizer = ({ name = 'nfkc', mode = 'compose' }: ICUNormalizerOptions = {}) => (str: string) => {
  const form = name === 'nfc' ? (mode === 'compose' ? 'NFC' : 'NFD') : (mode === 'compose' ? 'NFKC' : 'NFKD');
  return str.normalize(form);
};

export default ICUNormalizer;
