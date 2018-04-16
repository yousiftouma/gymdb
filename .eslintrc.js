module.exports = {
  extends: [
    'airbnb/legacy'
  ],
  parserOptions: {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
  rules: {
    camelcase: 0,
    'comma-dangle': [1, 'never'],
    'comma-spacing': [1, { before: false, after: true }],
    'consistent-return': 0,
    curly: 0,
    'default-case': 0,
    eqeqeq: [1, 'smart'],
    'func-names': 0,
    'guard-for-in': 1,
    indent: [1, 2, { SwitchCase: 1 }],
    'key-spacing': [1, { beforeColon: false, afterColon: true }],
    'keyword-spacing': [1, { before: true, after: true }],
    'max-len': 0,
    'new-cap': [1, { newIsCapExceptions: ['acl.memoryBackend', 'acl'] }],
    'no-bitwise': 0,
    'no-caller': 1,
    'no-console': 0,
    'no-else-return': 0,
    'no-empty-class': 0,
    'no-multi-spaces': 1,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'no-spaced-func': 1,
    'no-throw-literal': 1,
    'no-trailing-spaces': 1,
    'no-undef': 1,
    'no-unneeded-ternary': 1,
    'no-unreachable': 1,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'no-unused-vars': 0,
    'no-use-before-define': [1, 'nofunc'],
    'no-var': 0,
    'object-curly-spacing': [1, 'always'],
    'one-var': [0, 'never'],
    'one-var-declaration-per-line': [1, 'always'],
    'padded-blocks': 0,
    'space-before-function-paren': [1, {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'space-in-parens': [1, 'never'],
    'spaced-comment': [1, 'always'],
    strict: 0,
    'quote-props': 0,
    quotes: [1, 'single'],
    'wrap-iife': [1, 'outside'],
    'vars-on-top': 0
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    jasmine: true,
    mocha: true,
    jquery: true
  },
  globals: {
    angular: true,
    by: true,
    browser: true,
    element: true,
    inject: true,
    io: true,
    moment: true,
    Modernizr: true,
    Promise: true,
    __TESTING__: true,
    _: false,
    ApplicationConfiguration: true
  }
};
