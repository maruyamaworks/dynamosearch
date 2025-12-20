# Getting Started

This guide will help you install and configure DynamoSearch for your project.

## Requirements

- [Node.js 20+](https://nodejs.org/) installed
- AWS credentials configured (`aws configure`)

## Installation

Install DynamoSearch using npm, yarn, or pnpm:

::: code-group

```bash [npm]
npm install dynamosearch @aws-sdk/client-dynamodb
```

```bash [yarn]
yarn add dynamosearch @aws-sdk/client-dynamodb
```

```bash [pnpm]
pnpm add dynamosearch @aws-sdk/client-dynamodb
```

:::

For Japanese text analysis, also install the kuromoji plugin:

::: code-group

```bash [npm]
npm install @dynamosearch/plugin-analysis-kuromoji
```

```bash [yarn]
yarn add @dynamosearch/plugin-analysis-kuromoji
```

```bash [pnpm]
pnpm add @dynamosearch/plugin-analysis-kuromoji
```

:::

## Next Steps

Choose the appropriate setup guide based on your use case:

- **[Setting Up for New Tables](/guide/new-tables)** - Start here if you're creating a new DynamoDB table or don't have existing data to index
- **[Adding to Existing Tables](/guide/existing-tables)** - Follow this guide if you have an existing table with historical data that needs to be indexed
