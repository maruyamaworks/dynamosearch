# DynamoSearch

> Elasticsearch-inspired search, built for DynamoDB

- 🔍 BM25 Scoring
- 📊 Stream-Based Indexing
- 🔌 Pluggable Analysis
- 🌍 Multi-Language Support
- ⚡ Per-Attribute Boosting
- ☁️ Serverless-Friendly

DynamoSearch is a full-text search library for AWS DynamoDB that enables powerful search capabilities on your DynamoDB tables. It processes DynamoDB Streams to build and maintain a search index, implementing the BM25 scoring algorithm for relevance ranking.

[**Documentation**](https://maruyamaworks.github.io/dynamosearch/) &nbsp;|&nbsp; [**Get Started**](https://maruyamaworks.github.io/dynamosearch/guide/) &nbsp;|&nbsp; [**Live Demo**](https://maruyamaworks.github.io/dynamosearch/demo.html)

## Packages

| Package                                                                     | Version                                                                                                                |
| --------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| [dynamosearch](packages/dynamosearch)                                       | ![dynamosearch version](https://img.shields.io/npm/v/dynamosearch.svg?label=%20)                                       |
| [@dynamosearch/plugin-analysis-kuromoji](packages/plugin-analysis-kuromoji) | ![plugin-analysis-kuromoji version](https://img.shields.io/npm/v/@dynamosearch/plugin-analysis-kuromoji.svg?label=%20) |

## License

[MIT](LICENSE)
