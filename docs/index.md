---
layout: home

hero:
  name: DynamoSearch
  text: Search at scale, Serverless pricing
  tagline: Full-text search by DynamoDB, for DynamoDB
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/maruyamaworks/dynamosearch

features:
  - icon: 🔍
    title: BM25 Scoring
    details: Industry-standard relevance ranking algorithm for accurate search results with configurable parameters.
  - icon: 📊
    title: Stream-Based Indexing
    details: Automatically maintains search index from DynamoDB Streams, keeping your search in sync with your data.
  - icon: 🔌
    title: Pluggable Analysis
    details: Flexible text analysis pipeline with character filters, tokenizers, and token filters inspired by Elasticsearch.
  - icon: 🌍
    title: Multi-Language Support
    details: Built-in analyzers for English and Japanese (via plugin), with support for custom language analyzers.
  - icon: ⚡
    title: Per-Attribute Boosting
    details: Weight specific fields higher in search results to match your domain requirements.
  - icon: ☁️
    title: Serverless-Friendly
    details: Works seamlessly with AWS Lambda and SAM for fully managed search infrastructure.
---
