import importPlugin from 'eslint-plugin-import';
import jsonc from 'eslint-plugin-jsonc';
import packageJson from 'eslint-plugin-package-json';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-plugin-prettier/recommended';
import yml from 'eslint-plugin-yml';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export const config = (options = []) =>
  defineConfig([
    globalIgnores([
      '**/dist/**',
      '**/node_modules/**',
      '**/.expo/**',
      '**/Pods/**',
    ]),
    ...tseslint.configs.recommended,
    ...jsonc.configs['flat/recommended-with-jsonc'],
    ...yml.configs['flat/recommended'],
    {
      files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
      rules: {
        'jsonc/indent': ['error', 2],
      },
    },
    {
      files: ['**/*.yaml', '**/*.yml'],
      rules: {
        'yml/indent': ['error', 2],
      },
    },

    {
      files: ['**/package.json'],
      plugins: {
        'package-json': packageJson,
      },
      rules: {
        ...packageJson.configs.recommended.rules,
        'jsonc/sort-keys': [
          'error',
          {
            order: [
              'name',
              'version',
              'private',
              'description',
              'license',
              'author',
              'type',
              'main',
              'module',
              'types',
              'exports',
              'files',
              'scripts',
              'dependencies',
              'peerDependencies',
              'devDependencies',
              'engines',
              'publishConfig',
            ],
            pathPattern: '^$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
          },
        ],
      },
    },

    {
      plugins: {
        perfectionist,
      },
      rules: {
        'perfectionist/sort-imports': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              ['parent', 'sibling', 'index'],
            ],
            order: 'asc',
            type: 'natural',
          },
        ],

        'perfectionist/sort-jsx-props': [
          'error',
          {
            order: 'asc',
            type: 'natural',
          },
        ],
        'perfectionist/sort-named-exports': 'error',

        'perfectionist/sort-named-imports': 'error',

        'perfectionist/sort-objects': [
          'error',
          {
            order: 'asc',
            type: 'natural',
          },
        ],
      },
    },

    {
      plugins: {
        import: importPlugin,
      },

      rules: {
        'import/default': 'error',
        'import/named': 'error',
        'import/newline-after-import': 'error',
        'import/no-cycle': 'warn',

        'import/no-duplicates': 'error',
        'import/no-unresolved': 'error',

        'import/no-unused-modules': 'warn',
        'import/order': 'off', // let perfectionist handle sorting
      },

      settings: {
        'import/ignore': ['node_modules', 'react-native'],
        'import/resolver': {
          node: true, // resolves node_modules + relative path
          typescript: true,
        },
      },
    },

    prettier,

    ...(Array.isArray(options) ? options : [options]),
  ]);
