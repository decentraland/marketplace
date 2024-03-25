/* eslint-env node */
module.exports = {
  extends: ['@dcl/eslint-config/dapps'],
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname
  },
  plugins: ['react-hooks'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.cjs'],
      extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking', 'prettier'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'function',
            format: ['PascalCase', 'camelCase']
          }
        ],
        'import/no-named-as-default-member': 'off',
        '@typescript-eslint/ban-ts-comment': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/ban-ts-comment
        '@typescript-eslint/no-unsafe-assignment': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/no-unsafe-assignment/
        '@typescript-eslint/no-unsafe-call': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/no-unsafe-call/
        '@typescript-eslint/no-explicit-any': 'off' // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/no-explicit-any
      },
      parserOptions: {
        project: ['./tsconfig.json']
      }
    },
    {
      files: ['*.spec.ts'],
      rules: {
        '@typescript-eslint/unbound-method': 'off'
      }
    },
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
}
