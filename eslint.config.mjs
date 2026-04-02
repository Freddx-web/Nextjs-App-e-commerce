import { defineConfig } from "eslint/config";
import pluginNext from "@next/eslint-plugin-next";
import typescriptParser from "@typescript-eslint/parser";

const eslintConfig = defineConfig([
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": pluginNext,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "*.config.js", "*.config.ts"],
  },
]);

export default eslintConfig;
