module.exports = {
  printWidth: 120,
  trailingComma: 'all',
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  proseWrap: 'always',
  overrides: [
    {
      files: ['*.yml', '*.yaml'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
