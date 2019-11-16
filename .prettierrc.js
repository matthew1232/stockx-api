module.exports = {
  arrowParens: "avoid",
  bracketSpacing: true,
  endOfLine: "lf",
  jsxBracketSameLine: false,
  printWidth: 80,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  overrides: [
    {
      files: ["*.js", "*.jsx", "*.es", "*.es6", "*.mjs"],
      options: {
        printWidth: 100,
        parser: "babel"
      }
    },
    {
      files: ["*.json"],
      excludeFiles: ["package.json"],
      options: {
        parser: "json"
      }
    },

    {
      files: ["*.css", "*.css3", "*.css4"],
      options: {
        parser: "css"
      }
    },
    {
      files: ["*.scss"],
      options: {
        parser: "scss"
      }
    },
    {
      files: ["*.htm", "*.html"],
      options: {
        parser: "html"
      }
    },
    {
      files: ["*.md", "*.mdown"],
      options: {
        parser: "markdown"
      }
    }
  ]
};
