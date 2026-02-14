import { defineConfig, globalIgnores } from 'eslint/config';
import reactNativeA11y from 'eslint-plugin-react-native-a11y';
import prettier from 'eslint-plugin-prettier/recommended';
import jsonc from 'eslint-plugin-jsonc';
import packageJson from 'eslint-plugin-package-json';
import yml from 'eslint-plugin-yml';
import tseslint from 'typescript-eslint';

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
    prettier,

    ...(Array.isArray(options) ? options : [options]),
  ]);
