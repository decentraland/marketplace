/* eslint-env node */
module.exports = {
  extends: ['@dcl/eslint-config/dapps'],
  parserOptions: {
    project: ['tsconfig.json']
  },
  ignorePatterns: ['src/contracts/*']
}
