import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
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
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
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
            vue: vue,
        },
        rules: {
            // TypeScript specific rules
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'error',
            // '@typescript-eslint/type-annotation-spacing': 'error',
            // '@typescript-eslint/consistent-type-definitions': [
            //     'error',
            //     'interface',
            // ],
            // '@typescript-eslint/no-non-null-assertion': 'warn',

            // Vue specific rules
            // 'vue/html-closing-bracket-newline': [
            //     'error',
            //     {
            //         singleline: 'never',
            //         multiline: 'always',
            //     },
            // ],
            // 'vue/html-indent': ['error', 2],
            // 'vue/component-name-in-template-casing': ['error', 'PascalCase'],
            // 'vue/component-definition-name-casing': ['error', 'PascalCase'],
            // 'vue/match-component-file-name': [
            //     'error',
            //     {
            //         extensions: ['vue'],
            //         shouldMatchCase: true,
            //     },
            // ],
            // 'vue/max-attributes-per-line': [
            //     'error',
            //     {
            //         singleline: 3,
            //         multiline: 1,
            //     },
            // ],
            // 'vue/multi-word-component-names': 'error',
            // 'vue/no-unused-components': 'error',
            // 'vue/script-setup-uses-vars': 'error',

            // General JavaScript/ES6+ rules
            // 'no-console':
            //     process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            // 'no-debugger':
            //     process.env.NODE_ENV === 'production' ? 'error' : 'off',
            semi: ['error', 'never'],
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
