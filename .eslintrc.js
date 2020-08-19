module.exports = {
    env: {
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['simple-import-sort'],
    extends: [
        'eslint:recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'plugin:compat/recommended',
    ],
    rules: {
        'simple-import-sort/sort': 'error',
        'sort-imports': 'off',
    },
};
