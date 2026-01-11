import { withMermaid } from 'vitepress-plugin-mermaid';

export default withMermaid({
  base: '/dynamosearch/',
  title: 'DynamoSearch',
  description: 'Elasticsearch-inspired search, built for DynamoDB',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/dynamosearch/favicon.svg' }],
    ['meta', { property: 'og:description', content: 'Elasticsearch-inspired search, built for DynamoDB' }],
    ['meta', { property: 'og:image', content: 'https://maruyamaworks.github.io/dynamosearch/og.png' }],
    ['meta', { property: 'og:site_name', content: 'DynamoSearch' }],
  ],
  transformHead(context) {
    return [
      ['meta', { property: 'og:title', content: context.pageData.title || 'DynamoSearch' }],
      ['meta', { property: 'og:type', content: context.pageData.filePath === 'index.md' ? 'website' : 'article' }],
      ['meta', { property: 'og:url', content: `https://maruyamaworks.github.io/dynamosearch/${context.pageData.filePath.replace(/\.md$/, '.html')}` }],
    ];
  },
  vite: {
    optimizeDeps: {
      include: ['mermaid'],
    },
  },
  themeConfig: {
    logo: {
      dark: '/logo-dark.svg',
      light: '/logo-light.svg',
    },
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Reference', link: '/reference/' },
      { text: 'Live Demo', link: '/demo' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'How It Works', link: '/guide/how-it-works' },
            {
              text: 'Getting Started',
              link: '/guide/',
              items: [
                { text: 'Setting Up for New Tables', link: '/guide/new-tables' },
                { text: 'Adding to Existing Tables', link: '/guide/existing-tables' },
              ],
            },
            { text: 'Why DynamoSearch', link: '/guide/why' },
          ],
        },
        {
          text: 'Examples',
          items: [
            { text: 'AWS SAM Example', link: '/guide/sam-example' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Searching', link: '/guide/searching' },
            { text: 'Text Analysis', link: '/guide/text-analysis' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Cost Optimization', link: '/guide/cost-optimization' },
            { text: 'Index Table', link: '/guide/index-table' },
            { text: 'Reindexing', link: '/guide/reindexing' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Core APIs',
          items: [
            { text: 'DynamoSearch', link: '/reference/' },
            {
              text: 'Analyzers',
              link: '/reference/analyzers/',
              collapsed: false,
              items: [
                { text: 'Analyzer', link: '/reference/analyzers/analyzer' },
                { text: 'StandardAnalyzer', link: '/reference/analyzers/standard-analyzer' },
                { text: 'SimpleAnalyzer', link: '/reference/analyzers/simple-analyzer' },
                { text: 'WhitespaceAnalyzer', link: '/reference/analyzers/whitespace-analyzer' },
                { text: 'KeywordAnalyzer', link: '/reference/analyzers/keyword-analyzer' },
                { text: 'StopAnalyzer', link: '/reference/analyzers/stop-analyzer' },
                { text: 'PatternAnalyzer', link: '/reference/analyzers/pattern-analyzer' },
                { text: 'EnglishAnalyzer', link: '/reference/analyzers/english-analyzer' },
                { text: 'FrenchAnalyzer', link: '/reference/analyzers/french-analyzer' },
                { text: 'SpanishAnalyzer', link: '/reference/analyzers/spanish-analyzer' },
              ],
            },
            {
              text: 'Tokenizers',
              link: '/reference/tokenizers/',
              collapsed: false,
              items: [
                { text: 'Tokenizer', link: '/reference/tokenizers/tokenizer' },
                { text: 'StandardTokenizer', link: '/reference/tokenizers/standard-tokenizer' },
                { text: 'IntlSegmenterTokenizer', link: '/reference/tokenizers/intl-segmenter-tokenizer' },
                { text: 'KeywordTokenizer', link: '/reference/tokenizers/keyword-tokenizer' },
                { text: 'LetterTokenizer', link: '/reference/tokenizers/letter-tokenizer' },
                { text: 'LowerCaseTokenizer', link: '/reference/tokenizers/lowercase-tokenizer' },
                { text: 'WhitespaceTokenizer', link: '/reference/tokenizers/whitespace-tokenizer' },
                { text: 'NGramTokenizer', link: '/reference/tokenizers/ngram-tokenizer' },
                { text: 'PathHierarchyTokenizer', link: '/reference/tokenizers/path-hierarchy-tokenizer' },
                { text: 'PatternTokenizer', link: '/reference/tokenizers/pattern-tokenizer' },
                { text: 'SimplePatternTokenizer', link: '/reference/tokenizers/simple-pattern-tokenizer' },
                { text: 'SimplePatternSplitTokenizer', link: '/reference/tokenizers/simple-pattern-split-tokenizer' },
                { text: 'URLEmailTokenizer', link: '/reference/tokenizers/urlemail-tokenizer' },
              ],
            },
            {
              text: 'Character Filters',
              link: '/reference/char-filters/',
              collapsed: false,
              items: [
                { text: 'CharacterFilter', link: '/reference/char-filters/character-filter' },
                { text: 'ICUNormalizer', link: '/reference/char-filters/icu-normalizer' },
              ],
            },
            {
              text: 'Token Filters',
              link: '/reference/filters/',
              collapsed: false,
              items: [
                { text: 'TokenFilter', link: '/reference/filters/token-filter' },
                { text: 'LowerCaseFilter', link: '/reference/filters/lowercase-filter' },
                { text: 'UpperCaseFilter', link: '/reference/filters/uppercase-filter' },
                { text: 'CJKWidthFilter', link: '/reference/filters/cjk-width-filter' },
                { text: 'StopFilter', link: '/reference/filters/stop-filter' },
                { text: 'LengthFilter', link: '/reference/filters/length-filter' },
                { text: 'TruncateFilter', link: '/reference/filters/truncate-filter' },
                { text: 'LimitTokenCountFilter', link: '/reference/filters/limit-token-count-filter' },
                { text: 'ReverseStringFilter', link: '/reference/filters/reverse-string-filter' },
                { text: 'PorterStemFilter', link: '/reference/filters/porter-stem-filter' },
                { text: 'SnowballFilter', link: '/reference/filters/snowball-filter' },
                { text: 'TrimFilter', link: '/reference/filters/trim-filter' },
                { text: 'UniqueFilter', link: '/reference/filters/unique-filter' },
                { text: 'ASCIIFoldingFilter', link: '/reference/filters/ascii-folding-filter' },
                { text: 'NGramTokenFilter', link: '/reference/filters/ngram-token-filter' },
                { text: 'EdgeNGramTokenFilter', link: '/reference/filters/edge-ngram-token-filter' },
                { text: 'ShingleFilter', link: '/reference/filters/shingle-filter' },
                { text: 'CJKBigramFilter', link: '/reference/filters/cjk-bigram-filter' },
                { text: 'CommonGramsFilter', link: '/reference/filters/common-grams-filter' },
                { text: 'KeywordRepeatFilter', link: '/reference/filters/keyword-repeat-filter' },
                { text: 'KeywordMarkerFilter', link: '/reference/filters/keyword-marker-filter' },
                { text: 'RemoveDuplicatesTokenFilter', link: '/reference/filters/remove-duplicates-token-filter' },
                { text: 'ElisionFilter', link: '/reference/filters/elision-filter' },
                { text: 'ApostropheFilter', link: '/reference/filters/apostrophe-filter' },
                { text: 'EnglishPossessiveFilter', link: '/reference/filters/english-possessive-filter' },
                { text: 'KeepWordFilter', link: '/reference/filters/keep-word-filter' },
                { text: 'ConditionalTokenFilter', link: '/reference/filters/conditional-token-filter' },
              ],
            },
          ],
        },
        {
          text: '@dynamosearch/plugin-analysis-kuromoji',
          items: [
            {
              text: 'Analyzers',
              link: '/reference/plugins/analysis-kuromoji/analyzers/',
              collapsed: false,
              items: [
                { text: 'KuromojiAnalyzer', link: '/reference/plugins/analysis-kuromoji/analyzers/kuromoji-analyzer' },
              ],
            },
            {
              text: 'Tokenizers',
              link: '/reference/plugins/analysis-kuromoji/tokenizers/',
              collapsed: false,
              items: [
                { text: 'KuromojiTokenizer', link: '/reference/plugins/analysis-kuromoji/tokenizers/kuromoji-tokenizer' },
              ],
            },
            {
              text: 'Token Filters',
              link: '/reference/plugins/analysis-kuromoji/filters/',
              collapsed: false,
              items: [
                { text: 'KuromojiBaseFormFilter', link: '/reference/plugins/analysis-kuromoji/filters/kuromoji-base-form-filter' },
                { text: 'KuromojiPartOfSpeechStopFilter', link: '/reference/plugins/analysis-kuromoji/filters/kuromoji-part-of-speech-stop-filter' },
                { text: 'JapaneseStopFilter', link: '/reference/plugins/analysis-kuromoji/filters/japanese-stop-filter' },
                { text: 'KuromojiKatakanaStemFilter', link: '/reference/plugins/analysis-kuromoji/filters/kuromoji-katakana-stem-filter' },
              ],
            },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/maruyamaworks/dynamosearch' },
    ],
    editLink: {
      pattern: 'https://github.com/maruyamaworks/dynamosearch/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} Kenichi Maruyama`,
    },
  },
});
