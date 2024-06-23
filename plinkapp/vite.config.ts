/// <reference types="vitest" />
/// <reference types="vite/client" />


import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'process.env.OPENWEATHER_API_KEY': JSON.stringify(
        env.VITE_OPENWEATHER_API_KEY
      ),
      'process.env.GOOGLEMAPS_API_KEY': JSON.stringify(
        env.VITE_GOOGLEMAPS_API_KEY
      ),
    },

    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      css: true,
      setupFiles: "./src/test/setup.ts"
    }
  }
})
