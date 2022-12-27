module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jest: true,
        node: true,
    },
    rules: {
        'jsx-a11y/href-no-hash': ['off'],
        '@typescript-eslint/no-var-requires': 'warn',
        'react/jsx-filename-extension': 'off',
        '@typescript-eslint/indent': ['error', 2],
        'no-console': ['off'],
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'import/prefer-default-export': ['off'],
        '@typescript-eslint/interface-name-prefix': ['off'],
        '@typescript-eslint/explicit-function-return-type': ['off'],
        'import/extensions': 'off',
        'max-len': [
            'warn',
            {
                code: 100,
                tabWidth: 2,
                comments: 100,
                ignoreComments: false,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts', '.d.ts'],
            },
        },
    },
};