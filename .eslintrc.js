module.exports = {
    env: {
        browser: true,
        node: true,
        es2021: true,
        jest: true
    },
    settings: {
        react: {
            version: '18'
        }
    },
    extends: [
        'airbnb',
        'airbnb/hooks',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended'
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: ['react', 'import', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',
        'arrow-spacing': 'error',
        'key-spacing': 'error',
        'array-bracket-spacing': ['error', 'never'],
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'linebreak-style': ['error', 'unix'],
        semi: ['error', 'always'],
        'comma-spacing': ['error', { before: false, after: true }],
        curly: 'error',
        'eol-last': ['error', 'always'],
        eqeqeq: ['warn', 'allow-null'],
        'import/extensions': ['warn', { css: 'always', js: 'never' }],
        'keyword-spacing': ['error'],
        'no-console': ['error', { allow: ['error', 'debug'] }],
        'no-debugger': 'error',
        'no-extra-semi': 'error',
        'no-extra-parens': ['error', 'all', { ignoreJSX: 'all', nestedBinaryExpressions: false }],
        'no-irregular-whitespace': 'error',
        'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
        'no-trailing-spaces': ['error'],
        'no-undef': 'warn',
        'no-unused-vars': ['off', { args: 'none', vars: 'local' }],
        'object-curly-spacing': ['error', 'always'],
        'semi-spacing': 'warn',
        'space-in-parens': ['error', 'never'],
        'space-before-blocks': ['error'],
        'max-len': ['error', { code: 120, ignoreUrls: true }],
        // React rules
        'react/jsx-tag-spacing': 'error',
        'react/jsx-boolean-value': 'error',
        'react/jsx-closing-bracket-location': 'error',
        'react/jsx-curly-spacing': 'error',
        'react/jsx-indent-props': 'error',
        'react/jsx-max-props-per-line': 'off',
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-undef': 'warn',
        'react/jsx-sort-props': 'off',
        'react/jsx-uses-react': 'warn',
        'react/jsx-uses-vars': 'error',
        'react/no-did-mount-set-state': 'warn',
        'react/no-did-update-set-state': 'warn',
        'react/no-direct-mutation-state': 'error',
        'react/no-danger': 'warn',
        'react/no-multi-comp': 'warn',
        'react/no-set-state': 'off',
        'react/no-unknown-property': 'warn',
        'react/self-closing-comp': 'error',
        'react/sort-comp': 'warn',
        'react/jsx-wrap-multilines': 'warn',

        // Disabled for now
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/forbid-prop-types': 'off',
        'react/sort-prop-types': 'off'
    }
};
