import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      curly: ['error', 'all'],     // Wajib pakai kurung kurawal
      indent: ['error', 2],        // Indentasi 2 spasi
      semi: ['error', 'always'],   // Wajib pakai semicolon
      quotes: ['error', 'single'], // Pakai kutip satu
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.node },
  },
]);

