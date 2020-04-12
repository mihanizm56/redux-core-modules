module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:security/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  plugins: ['import', 'react-hooks', 'security'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        useTabs: false,
        printWidth: 80,
      },
    ],
    'no-implied-eval': 2,
    'jsx-a11y/media-has-caption': 'off',
    'import/prefer-default-export': 0,
    'prefer-destructuring': 0,
    'react/destructuring-assignment': 0,
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          ['internal', 'unknown'],
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'react/jsx-filename-extension': 'off',
    'import/no-extraneous-dependencies': 0,
    'no-console': ['error', { allow: ['error'] }],
    quotes: ['error', 'single'],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/no-static-element-interactions': [
      'error',
      {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp',
        ],
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['routeName'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'function-paren-newline': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/default-props-match-prop-types': 0,
    'react/require-default-props': 0,
    'react/jsx-wrap-multilines': [
      'error',
      { arrow: true, return: true, declaration: true },
    ],
    'react/jsx-one-expression-per-line': 0,
    'consistent-return': 0,
    '@typescript-eslint/indent': 0, // Conflicts with Prettier
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/interface-name-prefix': ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'no-case-declarations': 0,
    'no-extra-boolean-cast': 0,
    'react/state-in-constructor': 0,
    'no-async-promise-executor': 0,
    'max-classes-per-file': ['error', 2],
    'class-methods-use-this': 0,
    'security/detect-child-process': 0,
    'security/detect-object-injection': 0,
    'security/detect-non-literal-regexp': 0,
    'security/detect-non-literal-fs-filename': 0,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './lib']],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
      webpack: {
        config: './webpack.config.js',
      },
    },
  },
};
