import { test, expect } from 'vitest';
import PathHierarchyTokenizer from './PathHierarchyTokenizer.js';

test('PathHierarchyTokenizer', async () => {
  const tokenizer = new PathHierarchyTokenizer({ delimiter: '/' });
  const tokens = await tokenizer.tokenize('/one/two/three');
  expect(tokens).toMatchObject([
    { token: '/one', startOffset: 0, endOffset: 4, position: 0 },
    { token: '/one/two', startOffset: 0, endOffset: 8, position: 1 },
    { token: '/one/two/three', startOffset: 0, endOffset: 14, position: 2 },
  ]);
});
