import tseslint from "typescript-eslint";

export default tseslint.config(
  // Apply recommended TypeScript rules
  ...tseslint.configs.recommended,

  // Configure for TypeScript files across the monorepo
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Allow unused vars prefixed with underscore
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Allow explicit any in stubs/prototypes (can tighten later)
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Global ignores
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".next/**",
      ".expo/**",
      ".turbo/**",
      "coverage/**",
    ],
  }
);
