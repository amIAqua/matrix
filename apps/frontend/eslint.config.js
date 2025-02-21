import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import vue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
    {
        ignores: ['dist', 'node_modules', '*.config.js', '*.config.ts'],
    },
    js.configs.recommended,
    {
        files: ['**/*.js', '**/*.ts', '**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: typescriptParser,
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: false,
                },
            },
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.es2024,
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            vue,
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'error',

            // Vue specific rules
            // 'vue/html-closing-bracket-newline': [
            //     'error',
            //     {
            //         singleline: 'never',
            //         multiline: 'always',
            //     },
            // ],
            // 'vue/html-indent': ['error', 2],
            'vue/match-component-file-name': [
                'error',
                {
                    extensions: ['vue'],
                    shouldMatchCase: true,
                },
            ],
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: 3,
                    multiline: 1,
                },
            ],
            // 'vue/multi-word-component-names': 'error',
            'vue/no-unused-components': 'warn',
            // 'vue/script-setup-uses-vars': 'error',

            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'arrow-spacing': ['error', { before: true, after: true }],
            'no-var': 'error',
            'prefer-const': 'error',
            // eqeqeq: ['error', 'always'],
            // 'space-before-function-paren': ['error', 'always'],
            // 'space-before-blocks': ['error', 'always'],
            // 'object-curly-spacing': ['error', 'always'],
        },
    },
];
