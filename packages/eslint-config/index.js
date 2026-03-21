import { defineConfig, globalIgnores } from 'eslint/config';
import reactNativeA11y from 'eslint-plugin-react-native-a11y';
import perfectionist from "eslint-plugin-perfectionist"
import prettier from 'eslint-plugin-prettier/recommended';
import jsonc from 'eslint-plugin-jsonc';
import packageJson from 'eslint-plugin-package-json';
import yml from 'eslint-plugin-yml';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import'

export const config = (options = []) =>
  defineConfig([
    globalIgnores(['dist/*', 'node_modules/*', '.expo/*', '**/Pods/**']),
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
            pathPattern: '^$',
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
          },
          {
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
            order: { type: 'asc' },
          },
        ],
      },
    },

    {
      files: ['**/*.ts', '**/*.tsx'],
      languageOptions: {
        parser: tseslint.parser,
      },
      plugins: {
        'react-native-a11y': reactNativeA11y,
      },
      rules: {
        ...reactNativeA11y.configs.all.rules,
        'no-console': ['warn', { allow: ['warn', 'error'] }],
      },
    },

    {
      plugins: {
        perfectionist
      },
      rules: {
        'perfectionist/sort-imports': ['error', {
          type: 'natural',
          order: 'asc',
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
        }],

        'perfectionist/sort-named-imports': 'error',
        'perfectionist/sort-named-exports': 'error',

        'perfectionist/sort-objects': ['error', {
          type: 'natural',
          order: 'asc',
        }],

        'perfectionist/sort-jsx-props': ['error', {
          type: 'natural',
          order: 'asc',
        }],
      },
    },

    {
      plugins: {
        import: importPlugin,
      },

      settings: {
        'import/resolver': {
          node: true, // resolves node_modules + relative path
          typescript: true,
        },
      },

      rules: {
        'import/no-unresolved': 'error',
        'import/named': 'error',
        'import/default': 'error',
        'import/no-duplicates': 'error',

        'import/no-cycle': 'warn',
        'import/no-unused-modules': 'warn',

        'import/order': 'off', // let perfectionist handle sorting
        'import/newline-after-import': 'error',
      },
    },

    prettier,

    ...(Array.isArray(options) ? options : [options]),
  ]);
