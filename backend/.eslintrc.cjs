module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ], // for non react project
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: '**/tsconfig.json', // path of tsconfig file
  },
};
