import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '**/node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Some files import React for older tooling; ignore unused React warnings.
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }],
    },
  },
  // Backend (Node) files: enable Node globals to avoid false-positive 'process'/'Buffer' undefined errors
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      globals: globals.node,
      parserOptions: { ecmaVersion: 2022 },
    },
  },
])
