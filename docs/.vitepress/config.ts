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
      {
        text: 'v0.3.0',
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
            {
              text: 'Getting Started',
              link: '/guide/',
              items: [
                { text: 'Setting Up for New Tables', link: '/guide/new-tables' },
                { text: 'Adding to Existing Tables', link: '/guide/existing-tables' },
              ],
            },
          ],
        },
        {
          text: 'Examples',
          items: [
            { text: 'AWS SAM Example', link: '/guide/sam-example' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Text Analysis', link: '/guide/text-analysis' },
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
      copyright: 'Copyright © 2025 Kenichi Maruyama',
    },
  },
});
