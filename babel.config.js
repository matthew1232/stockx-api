module.exports = {
  presets: ['@babel/env'],
  plugins: [
    '@babel/transform-runtime',
    '@babel/proposal-class-properties',
    '@babel/proposal-export-default-from',
    '@babel/proposal-export-namespace-from',
    '@babel/proposal-function-bind',
    '@babel/proposal-json-strings',
    '@babel/syntax-dynamic-import',
    '@babel/syntax-import-meta',
  ],
  babelrcRoots: ['packages/*'],
  env: {
    production: {
      ignore: ['**/__tests__', '**/*.test.js'],
    },
    development: {
      ignore: ['**/__tests__', '**/*.test.js'],
    },
  },
};
