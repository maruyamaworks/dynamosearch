// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '**/build',
      '**/cache',
      '**/dist',
      'packages/dynamosearch/src/filters/snowball',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
);
