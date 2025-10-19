const nextCoreWebVitals = require('eslint-config-next/core-web-vitals.js')
const nextTypescript = require('eslint-config-next/typescript.js')
const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')
const tseslint = require('@typescript-eslint/eslint-plugin')
const tsparser = require('@typescript-eslint/parser')
const prettierConfig = require('eslint-config-prettier')

//import reactPlugin from 'eslint-plugin-react'

const path = require('path')
const baseDirectory = path.resolve('.')
const compat = new FlatCompat({ baseDirectory })

const coreExtends = nextCoreWebVitals && nextCoreWebVitals.default && nextCoreWebVitals.default.extends
    ? nextCoreWebVitals.default.extends
    : []

const tsExtends = nextTypescript && nextTypescript.default && nextTypescript.default.extends
    ? nextTypescript.default.extends
    : []

module.exports = [
    ...(coreExtends.length ? compat.extends(...coreExtends) : []),
    ...(tsExtends.length ? compat.extends(...tsExtends) : []),
    js.configs.recommended,
    prettierConfig,
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        plugins: {
            //      react: reactPlugin,
            '@typescript-eslint': tseslint,
        },
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            //      ...reactPlugin.configs.recommended.rules,
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
            '@typescript-eslint/consistent-type-definitions': [
                'error',
                'interface',
            ],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports' },
            ],
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/array-type': [
                'error',
                { default: 'array-simple' },
            ],
            '@typescript-eslint/member-ordering': [
                'warn',
                {
                    default: ['signature', 'field', 'constructor', 'method'],
                },
            ],
            '@typescript-eslint/prefer-readonly': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'warn',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
            '@typescript-eslint/no-meaningless-void-operator': 'error',
            '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
            '@typescript-eslint/prefer-regexp-exec': 'error',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare':
                'error',

            // Disable some rules that conflict with Standard
            'no-undef': 'off', // TypeScript handles this
            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': 'error',

            // Additional code quality rules
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'no-multiple-empty-lines': ['error', { max: 2 }],
            'no-trailing-spaces': 'warn',
            'eol-last': 'warn',
        },
    },
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            '.mastra/**',
            'eslint.config.js',
            'vitest.config.ts',
            'globalSetup.ts',
            'testSetup.ts',
            'vite.config.ts',
            '.github/**',
            '.kilocode/**',
            'scripts/**',
            '.gemini/**',
            '.github/prompts/**/*.md',
            '.github/chatmodes/*.md',
            'logs/*.log',
            '.kilocode/**/*.md',
            'memory-bank/**/*.md',
            '.spec/**',
            '.specstory/**',
            '.kiro/**',
            '.vscode/**',
            '.codacy/**',
            'docs/**',
            'components/ui/**',
            'docker/**',
            'public/**',
            'coverage/**',
            'LICENSE',
            'CHANGELOG.md',
            'README.md',
            'CONTRIBUTING.md',
        ],
    }
];
