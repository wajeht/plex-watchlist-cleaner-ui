import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
		hmr: true,
		host: '0.0.0.0',
		port: 3000,
		proxy: {
			'/api': {
				target: `http://localhost:800`,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '/api'),
			},
		},
	},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
