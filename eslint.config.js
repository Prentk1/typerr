import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js,
      prettier: pluginPrettier,
    },
    rules: {
      "prettier/prettier": "warn",
    },
    extends: ["js/recommended", prettier],
  },
  tseslint.configs.recommended,
]);
