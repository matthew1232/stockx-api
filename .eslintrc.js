module.exports = {
  env: {
    es6: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaFeatures: { jsx: false }, // to be overridden as necessary
    ecmaVersion: 2018,
  },
  plugins: ['prettier', 'react', 'import', 'jsx-a11y'],
  rules: {
    'prettier/prettier': 'error',
    'no-underscore-dangle': 'off',
    'camelcase': 'warn',
  },
};
