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
    'indent': ['error', 4],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      ts: 'never',
    }],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
