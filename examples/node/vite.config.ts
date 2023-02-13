import * as dotenv from 'dotenv'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import eslint from 'vite-plugin-eslint'

dotenv.config()
const { NODE_ENV } = process.env

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
    eslint({
      include: ['./server.ts', '**/*.{ts,tsx}'],
      exclude: ['vite.config.ts'],
      fix: NODE_ENV === 'production' ? false : true,
      lintOnStart: NODE_ENV === 'production' ? false : true,
    }),
  ],
})
