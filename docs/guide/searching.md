# Searching

DynamoSearch provides two ways to search your indexed data: the simple `search()` method for basic full-text search, and the powerful `query()` method with Elasticsearch DSL-like queries for advanced use cases.

## Simple Search

The `search()` method provides a straightforward way to perform full-text search across multiple attributes:

```typescript
const result = await dynamosearch.search('machine learning', {
  attributes: ['title', 'body'],
  maxItems: 20,
  minScore: 0.5,
  operator: 'OR',
});

console.log(result.items);
// [
//   { keys: { id: { S: '1' } }, score: 2.45 },
//   { keys: { id: { S: '2' } }, score: 1.82 },
//   ...
// ]
```

### Options

- **`attributes`** - Array of attribute names to search (required)
- **`maxItems`** - Maximum number of results to return (default: `10`)
- **`minScore`** - Minimum relevance score threshold (default: `0`)
- **`operator`** - Match operator: `'OR'` or `'AND'` (default: `'OR'`)
- **`minimumShouldMatch`** - Minimum number or percentage of terms that must match

## Advanced Search with Query DSL

The `query()` method supports Elasticsearch-inspired query DSL, enabling sophisticated search queries with fine-grained control over matching, scoring, and ranking.

```typescript
const result = await dynamosearch.query({
  query: {
    bool: {
      must: [
        { match: { title: 'machine learning' } }
      ],
      should: [
        { match: { body: 'neural networks' } }
      ],
    }
  },
  size: 10,
  minScore: 0.5,
});
```

### Query Types

DynamoSearch supports the following query types:

#### Match Query

Full-text search with text analysis on a single field:

```typescript
await dynamosearch.query({
  query: {
    match: {
      title: 'machine learning'
    }
  }
});

// With options
await dynamosearch.query({
  query: {
    match: {
      title: {
        query: 'machine learning',
        boost: 2,              // Score multiplier
        operator: 'AND',       // All terms must match
        minimumShouldMatch: 2  // At least 2 terms must match
      }
    }
  }
});
```

**Options:**
- `boost` - Multiplies the score (default: `1`)
- `operator` - `'OR'` or `'AND'` (default: `'OR'`)
- `minimumShouldMatch` - Minimum terms to match (number or percentage string)

#### Match Phrase Query

Searches for exact phrases with optional word distance:

```typescript
await dynamosearch.query({
  query: {
    matchPhrase: {
      title: {
        query: 'machine learning',
        slop: 2  // Allow up to 2 words between "machine" and "learning"
      }
    }
  }
});
```

**Options:**
- `boost` - Multiplies the score (default: `1`)
- `slop` - Maximum distance between tokens (default: `0`)

#### Combined Fields Query

Searches across multiple fields as if they were one unified field:

```typescript
await dynamosearch.query({
  query: {
    combinedFields: {
      query: 'artificial intelligence',
      fields: ['title^3', 'abstract^2', 'body'],  // Field names with optional boost
      operator: 'OR',
      minimumShouldMatch: '75%'
    }
  }
});
```

**Options:**
- `fields` - Array of field names with optional boost (e.g., `'title^2'`)
- `operator` - `'OR'` or `'AND'` (default: `'OR'`)
- `minimumShouldMatch` - Minimum terms to match

#### Multi-Match Query

Searches across multiple fields with different strategies:

**Best Fields** (default) - Uses the highest score from any field:

```typescript
await dynamosearch.query({
  query: {
    multiMatch: {
      query: 'neural networks',
      type: 'best_fields',
      fields: ['title^2', 'body'],
      tieBreaker: 0.3  // Weight for non-best field scores
    }
  }
});
```

**Most Fields** - Sums scores from all fields:

```typescript
await dynamosearch.query({
  query: {
    multiMatch: {
      query: 'deep learning',
      type: 'most_fields',
      fields: ['title', 'body', 'abstract']
    }
  }
});
```

**Phrase** - Match phrase across multiple fields:

```typescript
await dynamosearch.query({
  query: {
    multiMatch: {
      query: 'machine learning',
      type: 'phrase',
      fields: ['title', 'body'],
      slop: 1
    }
  }
});
```

**Cross Fields** - Treats multiple fields as one big field:

```typescript
await dynamosearch.query({
  query: {
    multiMatch: {
      query: 'John Smith',
      type: 'cross_fields',
      fields: ['firstName', 'lastName'],
      operator: 'AND'
    }
  }
});
```

#### Simple Query String

User-friendly query syntax supporting operators:

```typescript
await dynamosearch.query({
  query: {
    simpleQueryString: {
      query: '"machine learning" + algorithms -deep',
      fields: ['title', 'body'],
      defaultOperator: 'AND'
    }
  }
});
```

**Supported operators:**
- `+` - Must match (AND)
- `|` - Should match (OR)
- `-` - Must not match (NOT)
- `"..."` - Phrase query
- `*` - Prefix query
- `(...)` - Grouping

#### Boolean Query

Combines multiple queries with boolean logic:

```typescript
await dynamosearch.query({
  query: {
    bool: {
      must: [
        { match: { title: 'machine learning' } }
      ],
      should: [
        { match: { body: 'neural networks' } },
        { match: { body: 'deep learning' } }
      ],
      mustNot: [
        { match: { category: 'spam' } }
      ],
      filter: [
        { match: { status: 'published' } }
      ],
      minimumShouldMatch: 1
    }
  }
});
```

**Clauses:**
- `must` - All queries must match (contributes to score)
- `filter` - All queries must match (no scoring)
- `should` - At least `minimumShouldMatch` queries must match
- `mustNot` - None of these queries must match

#### Boosting Query

Reduces the score of documents matching a negative query:

```typescript
await dynamosearch.query({
  query: {
    boosting: {
      positive: { match: { body: 'apple' } },
      negative: { match: { body: 'fruit' } },
      negativeBoost: 0.5  // Documents matching "fruit" get 50% score
    }
  }
});
```

#### Constant Score Query

Wraps a query and returns a constant score for all matching documents:

```typescript
await dynamosearch.query({
  query: {
    constantScore: {
      filter: { match: { status: 'published' } },
      boost: 1.5
    }
  }
});
```

#### Disjunction Max Query

Returns the maximum score from multiple queries:

```typescript
await dynamosearch.query({
  query: {
    disMax: {
      queries: [
        { match: { title: 'database' } },
        { match: { body: 'database' } }
      ],
      tieBreaker: 0.3  // Weight for non-maximum scores
    }
  }
});
```

### Minimum Should Match

The `minimumShouldMatch` parameter supports multiple formats:

```typescript
// Integer: At least 2 clauses must match
minimumShouldMatch: 2

// Negative integer: All but 1 must match
minimumShouldMatch: -1

// Percentage: At least 75% of clauses
minimumShouldMatch: '75%'

// Negative percentage: All but 25%
minimumShouldMatch: '-25%'

// Conditional: If >3 clauses, 90% must match; otherwise all must match
minimumShouldMatch: '3<90%'
```

## Result Format

Both `search()` and `query()` return results in the same format:

```typescript
interface QueryResult {
  items: Array<{
    keys: Record<string, AttributeValue>;  // DynamoDB document keys
    score: number;                          // BM25 relevance score
  }>;
  consumedCapacity: {
    capacityUnits: number;
    tableName: string;
  };
}
```
