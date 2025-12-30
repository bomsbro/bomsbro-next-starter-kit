import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // Next.js 기본 설정
  ...nextVitals,
  ...nextTs,

  // Next.js 관련 폴더 무시
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**']),

  // 커스텀 규칙
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // ============ Import 정렬 ============
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          alphabetize: { order: 'asc' },
          pathGroups: [
            {
              pattern: '{react*/**,react*,react}',
              group: 'builtin',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'builtin', 'index'],
          'newlines-between': 'always',
        },
      ],

      // ============ TypeScript ============
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],

      // ============ React (eslint-config-next에서 제공) ============
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/hook-use-state': 'warn',
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-constructed-context-values': 'error',
      'react/no-array-index-key': 'warn',

      // ============ ES6+ 모던 문법 ============
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-template': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      'arrow-body-style': ['error', 'as-needed'],
      'object-shorthand': ['error', 'always'],
      'no-useless-rename': 'error',
      'no-useless-computed-key': 'error',

      // ============ 코드 품질 ============
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-wrappers': 'error',
      '@typescript-eslint/only-throw-error': 'error',
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'no-lonely-if': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-param-reassign': ['error', { props: false }],
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      'require-await': 'off',
      '@typescript-eslint/require-await': 'warn',
      'no-await-in-loop': 'warn',
      'no-promise-executor-return': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-duplicate-imports': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'warn',
      'default-case-last': 'error',
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      'no-constructor-return': 'error',
    },
  },
  eslintConfigPrettier,
]);
