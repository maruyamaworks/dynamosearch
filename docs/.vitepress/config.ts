import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/dynamosearch/',
  title: 'DynamoSearch',
  description: 'Full-text search by DynamoDB, for DynamoDB',
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
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
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Why DynamoSearch', link: '/guide/why' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Text Analysis', link: '/guide/text-analysis' },
            { text: 'BM25 Ranking', link: '/guide/bm25-ranking' },
            { text: 'Index Management', link: '/guide/index-management' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Custom Analyzers', link: '/guide/custom-analyzers' },
            { text: 'AWS Lambda Integration', link: '/guide/lambda-integration' },
            { text: 'Reindexing', link: '/guide/reindexing' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'DynamoSearch', link: '/api/dynamosearch' },
            { text: 'Analyzers', link: '/api/analyzers' },
            { text: 'Tokenizers', link: '/api/tokenizers' },
            { text: 'Filters', link: '/api/filters' },
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
