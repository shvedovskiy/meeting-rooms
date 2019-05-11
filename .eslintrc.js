module.exports = {
  extends: [
    "react-app",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin package
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array
  ],
  rules: {
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/prefer-interface": 0,
    "@typescript-eslint/no-explicit-any": 0
  },
  overrides: [
    {
      files: ['__tests__/**/*.ts', '__tests__/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 0,
      },
    },
    {
      files: ['server/**/*.ts'],
      rules: {
        "react-hooks/rules-of-hooks": 0
      }
    }
  ],
}
