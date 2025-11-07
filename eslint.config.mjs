import mridang from '@mridang/eslint-defaults';
import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['README.md', 'README.md/**', 'src/components/index.d.ts'],
  },
  ...mridang.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: null,
        extraFileExtensions: ['.astro'],
      },
    },
  },
  {
    files: ['**/*.astro/*.ts', '*.astro/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
];
