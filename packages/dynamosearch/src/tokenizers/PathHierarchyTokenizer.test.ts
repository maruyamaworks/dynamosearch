import { test, expect } from 'vitest';
import PathHierarchyTokenizer from './PathHierarchyTokenizer.js';

test('PathHierarchyTokenizer', async () => {
  const tokenizer = new PathHierarchyTokenizer({ delimiter: '/' });
  const tokens = await tokenizer.tokenize('/one/two/three');
  expect(tokens).toMatchObject([
    { text: '/one' },
    { text: '/one/two' },
    { text: '/one/two/three' },
  ]);
});
