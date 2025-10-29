import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // Set the rule severity to "warn" (or 1) for explicit any types
      "@typescript-eslint/no-explicit-any": "warn",

      // Disable the core ESLint and TypeScript no-unused-vars rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Use the correct rule names from the unused-imports plugin
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      // Standard ESLint rules from the built-in configs are available
      "no-console": "warn",
      "no-undef": "error",
      "no-unused-expressions": "error",
      "no-unused-labels": "error",
    },
  },
];
