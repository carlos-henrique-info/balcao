/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No GitHub Actions o deploy define VITE_BASE=/<nome-do-repositorio>/
// (GitHub Pages serve o projeto em https://<usuario>.github.io/<repo>/).
// Localmente, o padrão é '/'.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
