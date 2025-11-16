import { withMermaid } from 'vitepress-plugin-mermaid';

export default withMermaid({
  base: '/dynamosearch/',
  title: 'DynamoSearch',
  description: 'Full-text search by DynamoDB, for DynamoDB',
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
      {
        text: 'v0.2.4',
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/maruyamaworks/dynamosearch/releases',
          },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Why DynamoSearch', link: '/guide/why' },
            { text: 'Getting Started', link: '/guide/' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Text Analysis', link: '/guide/text-analysis' },
            { text: 'Custom Analyzers', link: '/guide/custom-analyzers' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'AWS Lambda Integration', link: '/guide/lambda-integration' },
            { text: 'Cost Optimization', link: '/guide/cost-optimization' },
            { text: 'Index Table', link: '/guide/index-table' },
            { text: 'Reindexing', link: '/guide/reindexing' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Core API',
          items: [
            { text: 'DynamoSearch', link: '/reference/' },
            { text: 'Analyzers', link: '/reference/analyzers' },
            { text: 'Tokenizers', link: '/reference/tokenizers' },
            { text: 'Character Filters', link: '/reference/char-filters' },
            { text: 'Token Filters', link: '/reference/filters' },
          ],
        },
        {
          text: 'Plugins',
          items: [
            {
              text: '@dynamosearch/plugin-analysis-kuromoji',
              link: '/reference/plugins/analysis-kuromoji/',
              items: [
                { text: 'Analyzers', link: '/reference/plugins/analysis-kuromoji/analyzers' },
                { text: 'Tokenizers', link: '/reference/plugins/analysis-kuromoji/tokenizers' },
                { text: 'Token Filters', link: '/reference/plugins/analysis-kuromoji/filters' },
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
      copyright: 'Copyright © 2024 Kenichi Maruyama',
    },
  },
});
