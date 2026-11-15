import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),

  // --- Codigo de la aplicacion ---------------------------------------------
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['src/test/**'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },

  // --- Pruebas unitarias ----------------------------------------------------
  // Las pruebas se ejecutan con Karma + Jasmine, que inyecta sus propios
  // globales (describe, it, expect, beforeEach...). Sin declararlos, ESLint
  // los reporta como no definidos y el pipeline falla en la etapa de lint.
  {
    files: ['src/test/**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.jasmine,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  // --- Contextos de React ---------------------------------------------------
  // Los archivos de contexto exportan dos cosas: el componente Provider y el
  // hook que lo consume. Es el patron recomendado por la documentacion de
  // React, pero la regla react-refresh/only-export-components lo considera
  // un error porque el archivo no exporta solo componentes.
  //
  // La regla se desactiva para estos archivos: separarlos en dos (un
  // Provider y un hook) haria que el modulo del hook se recargara al
  // cambiar el Provider, que es exactamente lo que Fast Refresh evita.
  {
    files: ['src/context/**/*.{js,jsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
