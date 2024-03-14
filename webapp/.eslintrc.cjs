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
        '@typescript-eslint/no-floating-promises': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/no-floating-promises
        '@typescript-eslint/no-unsafe-return': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/no-unsafe-return
        '@typescript-eslint/naming-convention': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/naming-convention/
        '@typescript-eslint/explicit-module-boundary-types': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/explicit-module-boundary-types
        '@typescript-eslint/ban-ts-comment': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/ban-ts-comment
        '@typescript-eslint/no-unsafe-assignment': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/no-unsafe-assignment/
        '@typescript-eslint/no-unsafe-call': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/no-unsafe-call/
        '@typescript-eslint/no-unsafe-member-access': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/no-unsafe-member-access/
        '@typescript-eslint/no-unsafe-argument': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/no-unsafe-argument/
        '@typescript-eslint/no-explicit-any': 'off', // TODO: migrate code progressively to remove this line. https://typescript-eslint.io/rules/no-explicit-any
        'import/order': 'off' // TODO: migrate code progressively to remove this line.
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
