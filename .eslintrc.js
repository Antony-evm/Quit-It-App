module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
      },
    },
    {
      files: [
        '.eslintrc.js',
        'babel.config.js',
        'metro.config.js',
        'jest.config.js',
        'tailwind.config.js',
        'index.js',
      ],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
  ],
  ignorePatterns: ['babel.config.js', 'metro.config.js', 'jest.config.js'],
};
