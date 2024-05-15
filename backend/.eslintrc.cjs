module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base'], // for non react project
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './backend/tsconfig.json', // path of tsconfig file
  },
};
