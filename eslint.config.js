import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import tsdoc from 'eslint-plugin-tsdoc'
import jsdoc from 'eslint-plugin-jsdoc'
import prettierConfig from 'eslint-config-prettier'
import nextPlugin from 'eslint-config-next'
import reactPlugin from 'eslint-plugin-react'

export default [
  js.configs.recommended,
  prettierConfig,
  nextPlugin,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': tseslint,
      'tsdoc': tsdoc,
      'jsdoc': jsdoc
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'bundler',
        project: './tsconfig.json'
      }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      // Standard style guide rules
      'no-unused-vars': 'warn', // Turn off base rule
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-var': 'warn',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'warn',
      'no-shadow': 'off', // Turn off base rule for TS version
      '@typescript-eslint/no-shadow': 'error',

      // TypeScript specific rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/member-ordering': [
        'warn',
        {
          default: [
            'signature',
            'field',
            'constructor',
            'method'
          ]
        }
      ],
      '@typescript-eslint/prefer-readonly': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-meaningless-void-operator': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
      '@typescript-eslint/prefer-regexp-exec': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',

      // Disable some rules that conflict with Standard
      'no-undef': 'off', // TypeScript handles this
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',

      // Additional code quality rules
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-trailing-spaces': 'warn',
      'eol-last': 'warn',

      // TSDoc documentation rules
      'tsdoc/syntax': 'warn',



      // JSDoc documentation rules
      'jsdoc/check-alignment': 'warn',
      'jsdoc/check-indentation': 'warn',
      'jsdoc/check-param-names': 'warn',
      'jsdoc/check-property-names': 'warn',
      'jsdoc/check-syntax': 'warn',


      'jsdoc/require-param': 'warn', // Changed from 'warb' to 'warn'
      'jsdoc/require-param-description': 'warn', // Changed from 'error' to 'warn'
    }
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.js',
      '.mastra/**',
      'eslint.config.js',
      'vitest.config.ts',
      'globalSetup.ts',
      'testSetup.ts',
      'vite.config.ts'
    ]
  }
]