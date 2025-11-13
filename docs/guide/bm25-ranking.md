# BM25 Ranking

DynamoSearch uses the BM25 (Best Matching 25) algorithm for relevance scoring. BM25 is an industry-standard ranking function used by major search engines.

## How BM25 Works

BM25 calculates a relevance score based on three factors:

### 1. Term Frequency (TF)

How often a search term appears in a document. More occurrences generally indicate higher relevance, but with diminishing returns.

### 2. Inverse Document Frequency (IDF)

How rare a term is across all documents. Rare terms are more valuable for ranking than common terms.

The IDF formula used:
```
IDF = log(1 + (N - df + 0.5) / (df + 0.5))
```
Where:
- `N` = total number of documents
- `df` = number of documents containing the term

### 3. Document Length Normalization

Shorter documents with a term match may be more relevant than longer documents with the same term frequency.

## BM25 Formula

For each term in the query:

```
score = IDF × (TF × (k1 + 1)) / (TF + k1 × (1 - b + b × (docLength / avgDocLength)))
```

Parameters:
- `k1`: Controls term frequency saturation (default: 1.2)
- `b`: Controls length normalization (default: 0.75)
- `TF`: Term frequency in the document
- `docLength`: Number of tokens in the document
- `avgDocLength`: Average document length across all documents

## Configuring BM25 Parameters

### k1 Parameter

Controls how quickly term frequency saturates. Higher values give more weight to repeated terms.

```typescript
// Default k1 = 1.2
const results = await dynamosearch.search('machine learning', {
  bm25: { k1: 1.2 }
});

// Higher k1: More weight to term frequency
const results = await dynamosearch.search('machine learning', {
  bm25: { k1: 2.0 }  // Repeated terms matter more
});

// Lower k1: Less weight to term frequency
const results = await dynamosearch.search('machine learning', {
  bm25: { k1: 0.5 }  // Repeated terms matter less
});
```

**When to adjust k1:**
- Higher k1 (1.5-2.0): When term repetition indicates relevance (e.g., product descriptions)
- Lower k1 (0.8-1.0): When term repetition is less important (e.g., news articles)

### b Parameter

Controls length normalization. Higher values penalize longer documents more.

```typescript
// Default b = 0.75
const results = await dynamosearch.search('machine learning', {
  bm25: { b: 0.75 }
});

// Higher b: Stronger length normalization
const results = await dynamosearch.search('machine learning', {
  bm25: { b: 1.0 }  // Heavily favor shorter documents
});

// Lower b: Weaker length normalization
const results = await dynamosearch.search('machine learning', {
  bm25: { b: 0.0 }  // Ignore document length
});
```

**When to adjust b:**
- Higher b (0.8-1.0): When document length is informative (e.g., short titles vs long articles)
- Lower b (0.3-0.5): When all documents are similar length

## Attribute Boosting

Boost specific fields to weight them higher in scoring:

```typescript
const results = await dynamosearch.search('machine learning', {
  attributes: [
    'title^3',    // Boost title 3x
    'abstract^2', // Boost abstract 2x
    'body'        // Standard weight (1x)
  ]
});
```

**How boosting works:**

Each term's score is multiplied by the boost factor:
```
finalScore = boost × score
```

**Common boost patterns:**
- **Title > Body**: `title^2, body`
- **Title > Abstract > Body**: `title^3, abstract^2, body`
- **Equal weight**: `title, body` (no boost)

## Score Filtering

Filter results by minimum score to remove low-relevance matches:

```typescript
const results = await dynamosearch.search('machine learning', {
  minScore: 1.0  // Only return documents with score >= 1.0
});
```

**Guidelines for minScore:**
- **0.0-0.5**: Very permissive, includes weak matches
- **0.5-1.0**: Moderate threshold, good balance
- **1.0-2.0**: Strict threshold, only strong matches
- **2.0+**: Very strict, only exact or near-exact matches

## Multi-Term Queries

For queries with multiple terms, scores are summed:

```typescript
const results = await dynamosearch.search('machine learning algorithms');
// Score = score('machine') + score('learning') + score('algorithms')
```

Documents matching all terms typically score higher than documents matching only some terms.

## Understanding Score Values

Score values are relative, not absolute. They depend on:
- Document collection size
- Term frequency distribution
- Document length distribution
- BM25 parameters
- Boost factors

**Example scores:**
```typescript
const results = await dynamosearch.search('machine learning', {
  attributes: ['title^2', 'body']
});

// Typical score ranges:
// 5.0+   : Excellent match (term in title, high relevance)
// 2.0-5.0: Good match (term in body or title)
// 1.0-2.0: Fair match (term appears but not frequently)
// 0.5-1.0: Weak match (rare term or long document)
// <0.5   : Very weak match
```

## Practical Tips

### 1. Start with Defaults

The default parameters work well for most use cases:
```typescript
const results = await dynamosearch.search('query', {
  attributes: ['title^2', 'body'],
  minScore: 0.5
});
```

### 2. Tune Based on Results

If results are too broad:
- Increase `minScore`
- Increase `k1` (if term frequency matters)
- Increase boost on important fields

If results are too narrow:
- Decrease `minScore`
- Decrease `k1`
- Reduce boost differences

### 3. Test with Real Queries

Use your actual data and queries to tune parameters:

```typescript
const testQueries = [
  'machine learning',
  'deep neural networks',
  'natural language processing'
];

for (const query of testQueries) {
  const results = await dynamosearch.search(query, {
    attributes: ['title^2', 'body'],
    minScore: 0.5
  });
  console.log(`Query: ${query}, Results: ${results.items.length}`);
  console.log('Top scores:', results.items.slice(0, 3).map(r => r.score));
}
```

### 4. Monitor Consumed Capacity

Check DynamoDB consumed capacity to optimize cost:

```typescript
const results = await dynamosearch.search('query');
console.log('Consumed capacity:', results.consumedCapacity);
```

## Next Steps

- [Index Management](/guide/index-management) - Optimize your index structure
- [AWS Lambda Integration](/guide/lambda-integration) - Deploy to production
