import eslint from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";

export default eslint.defineConfig([
  {
    root: true,
    ignores: ["eslint.config.mjs", "dist/", "build/", "node_modules/"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
      sourceType: "module",
      parserOptions: {
        ecmaVersion: "latest",
      },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    extends: [eslint.configs.recommended, "prettier"],

    rules: {
      "prettier/prettier": [
        "error",
        {
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: true,
          trailingComma: "es5",
          bracketSpacing: true,
          arrowParens: "always",
          endOfLine: "lf",
        },
      ],
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-debugger": "error",
    },

    overrides: [
      {
        files: ["**/*.test.js", "**/__tests__/**/*.js"],
        rules: {
          "no-unused-expressions": "on",
        },
      },
    ],
  },
]);
