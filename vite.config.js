import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss(),],
  // Settings for `npm test` (Vitest). The pattern lists `.JS` as well because
  // src/tests/Taskhelpers.test.JS has an upper-case extension and file matching
  // is case-sensitive on Linux, so it would otherwise be skipped there.
  test: {
    include: ['src/**/*.test.{js,JS}'],
  },
})