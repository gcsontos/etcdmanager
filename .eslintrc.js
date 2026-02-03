module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
    },
    extends: [
        'plugin:vue/essential',
        'airbnb-base',
        '@vue/typescript/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2022,
        parser: '@typescript-eslint/parser',
    },
    rules: {
        'max-len': ['error', { code: 140 }],
        indent: ['error', 4],
        'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/ban-ts-comment': 'off',
        'import/extensions': ['error', 'ignorePackages', {
            js: 'never',
            ts: 'never',
            vue: 'always',
        }],
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-underscore-dangle': 'off',
        'no-param-reassign': ['error', { props: false }],
        'class-methods-use-this': 'off',
        'lines-between-class-members': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
    extends: [
        'plugin:vue/essential',
        'airbnb-base',
        '@vue/typescript/recommended',
    ],
    plugins: ['vuejs-accessibility'],
    parserOptions: {
        strict: 'off',
        'lines-around-directive': 'off',
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'off',
        'no-restricted-syntax': 'off',
        'no-bitwise': 'off',
        'default-case': 'off',
        'consistent-return': 'off',
        'prefer-promise-reject-errors': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'no-plusplus': 'off',
        'no-continue': 'off',
        'no-await-in-loop': 'off',
        'no-nested-ternary': 'off',
        'prefer-destructuring': 'off',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'implicit-arrow-linebreak': 'off',
        'function-paren-newline': 'off',
        'func-names': 'off',
        'default-case-last': 'off',
        'no-useless-catch': 'error',
        'max-classes-per-file': 'off',
        'no-multi-assign': 'off',
        'vue/valid-v-slot': 'off',
        'vue/no-v-text-v-html-on-component': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
        }],
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                'max-len': 'off',
            },
        },
        {
            files: ['src/lib/validators.ts', 'src/i18n/*.ts'],
            rules: {
                'max-len': 'off',
            },
        },
        {
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/no-unused-vars': 'off',
            },
        },
        {
            files: ['src/lib/*.ts'],
            rules: {
                '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            },
        },
    ],
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.json',
            },
            node: {
                extensions: ['.js', '.ts', '.vue'],
            },
        },
    },
};
