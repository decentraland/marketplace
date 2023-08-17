/* eslint-env node */
module.exports = {
  extends: ['@dcl/eslint-config/dapps'],
  parserOptions: {
    project: ['tsconfig.json']
  },
  overrides: [
    {
      files: ['*.js', '*.ts', '*.tsx'],
      rules: {
        ['prettier/prettier']: [
          'error',
          {
            printWidth: 80,
            singleQuote: true,
            semi: false,
            trailingComma: 'none'
          }
        ]
      }
    }
  ],
  ignorePatterns: ['src/contracts/*']
}
