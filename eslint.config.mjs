import js from '@eslint/js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

/** @type {import('eslint').Linter.Config} */
export default [
  { ignores: ['_site/*', 'assets/*', 'vendor/*', '*.config.js'] },
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-console': 'error',
      'no-else-return': 'error',
      'no-throw-literal': 'error',
      'no-useless-return': 'error',
      'no-whitespace-before-property': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
];
