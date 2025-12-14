import { test, expect, beforeAll } from 'vitest';
import EnglishAnalyzer from './analyzers/EnglishAnalyzer.js';
import DynamoSearch from './index.js';

const createDynamoSearchClient = () => {
  const analyzer = new EnglishAnalyzer();
  const dynamosearch = new DynamoSearch({
    indexTableName: 'dynamosearch_test-search',
    fields: [
      { name: 'title', analyzer },
      { name: 'description', analyzer },
    ],
    keySchema: [{ name: 'id', type: 'HASH' }],
    dynamoDBClientConfig: {
      endpoint: 'http://localhost:8000',
    },
  });

  return dynamosearch;
};

beforeAll(async () => {
  const dynamosearch = createDynamoSearchClient();
  await dynamosearch.deleteIndexTable({ ifExists: true });
  await dynamosearch.createIndexTable();
  await dynamosearch.reindex([
    {
      id: { N: '1' },
      title: { S: 'Example Item #1' },
      description: { S: 'The quick brown fox jumps over the lazy dog' },
    },
    {
      id: { N: '2' },
      title: { S: 'Example Item #2' },
      description: { S: 'Pack my box with five dozen liquor jugs' },
    },
    {
      id: { N: '3' },
      title: { S: 'Example Item #3' },
      description: { S: 'The five boxing wizards jump quickly' },
    },
  ]);
});

test('match query (OR)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: { match: { description: 'fox jumps' } },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
    { keys: { id: { N: '3' } }, score: expect.closeTo(0.51) },
  ]);
});

test('match query (AND)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: { match: { description: { query: 'fox jumps', operator: 'AND' } } },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
  ]);
});

test('match phrase query', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: { matchPhrase: { description: 'fox jumps' } },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
  ]);
});

test('match phrase query', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: { matchPhrase: { description: 'jumps fox' } },
  });
  expect(items).toEqual([]);
});

test('combined fields query', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      combinedFields: {
        query: 'fox jumps',
        fields: ['title', 'description'],
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
    { keys: { id: { N: '3' } }, score: expect.closeTo(0.51) },
  ]);
});

test('multi match query (best_fields)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      multiMatch: {
        query: 'fox jumps',
        type: 'best_fields',
        fields: ['title', 'description'],
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
    { keys: { id: { N: '3' } }, score: expect.closeTo(0.51) },
  ]);
});

test('multi match query (most_fields)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      multiMatch: {
        query: 'fox jumps',
        type: 'most_fields',
        fields: ['title', 'description'],
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
    { keys: { id: { N: '3' } }, score: expect.closeTo(0.51) },
  ]);
});

test('multi match query (cross_fields)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      multiMatch: {
        query: 'fox jumps',
        type: 'cross_fields',
        fields: ['title', 'description'],
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
    { keys: { id: { N: '3' } }, score: expect.closeTo(0.51) },
  ]);
});

test('multi match query (phrase)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      multiMatch: {
        query: 'fox jumps',
        type: 'phrase',
        fields: ['title', 'description'],
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
  ]);
});

test('boolean query (SHOULD)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      bool: {
        should: [
          { match: { description: 'fox' } },
          { match: { description: 'jumps' } },
        ],
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
    { keys: { id: { N: '3' } }, score: expect.closeTo(0.51) },
  ]);
});

test('boolean query (MUST)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      bool: {
        must: [
          { match: { description: 'fox' } },
        ],
        should: [
          { match: { description: 'jumps' } },
        ],
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
  ]);
});

test('boolean query (MUST NOT)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      bool: {
        mustNot: [
          { match: { description: 'lazy' } },
        ],
        should: [
          { match: { description: 'fox' } },
          { match: { description: 'jumps' } },
        ],
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '3' } }, score: expect.closeTo(0.51) },
  ]);
});

test('boolean query (FILTER)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      bool: {
        filter: [
          { match: { description: 'fox' } },
        ],
        should: [
          { match: { description: 'jumps' } },
        ],
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(0.45) },
  ]);
});

test('boosting query', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      boosting: {
        positive: { match: { description: 'fox jumps' } },
        negative: { match: { description: 'lazy' } },
        negativeBoost: 0.3,
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '3' } }, score: expect.closeTo(0.51) },
    { keys: { id: { N: '1' } }, score: expect.closeTo(0.42) },
  ]);
});

test('constant score query', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      constantScore: {
        filter: { match: { description: 'fox' } },
        boost: 2,
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: 2 },
  ]);
});

test('disjunction max query', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: {
      disMax: {
        queries: [
          { match: { title: 'fox jumps' } },
          { match: { description: 'fox jumps' } },
        ],
      },
    },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(1.39) },
    { keys: { id: { N: '3' } }, score: expect.closeTo(0.51) },
  ]);
});

test('search', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.search('quick brown fox');
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(2.82) },
  ]);
});

test('search', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.search('quick brown "fox');
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(2.82) },
  ]);
});

test('minimum should match (integer)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: { match: { description: { query: 'quick brown fox jumps', minimumShouldMatch: '2' } } },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(3.27) },
  ]);
});

test('minimum should match (percentage)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: { match: { description: { query: 'quick brown fox jumps', minimumShouldMatch: '25%' } } },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(3.27) },
    { keys: { id: { N: '3' } }, score: expect.closeTo(0.51) },
  ]);
});

test('minimum should match (negative percentage)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: { match: { description: { query: 'quick brown fox jumps', minimumShouldMatch: '-25%' } } },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(3.27) },
  ]);
});

test('minimum should match (combination)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: { match: { description: { query: 'quick brown fox jumps', minimumShouldMatch: '5<25%' } } },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(3.27) },
  ]);
});

test('minimum should match (multiple combination)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const { items } = await dynamosearch.query({
    query: { match: { description: { query: 'quick brown fox jumps', minimumShouldMatch: '3<50% 5<25%' } } },
  });
  expect(items).toEqual([
    { keys: { id: { N: '1' } }, score: expect.closeTo(3.27) },
  ]);
});

test('minimum should match (invalid parameter)', async () => {
  const dynamosearch = createDynamoSearchClient();
  const query = dynamosearch.query({
    query: { match: { description: { query: 'quick brown fox jumps', minimumShouldMatch: '50% 25%' } } },
  });
  await expect(query).rejects.toThrowError('Invalid minimumShouldMatch value');
});
