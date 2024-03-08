/* eslint-env node */
module.exports = {
  extends: ['@dcl/eslint-config/dapps'],
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname
  },
  overrides: [
    {
      files: ['*.js', '*.ts', '*.tsx'],
      rules: {
        ['prettier/prettier']: [
          'error',
          {
            semi: false,
            singleQuote: true,
            printWidth: 140,
            tabWidth: 2,
            trailingComma: 'none',
            arrowParens: 'avoid'
          }
        ]
      }
    }
  ]
}
