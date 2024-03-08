import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config(path.resolve(path.join(process.cwd(), '.env')));

const rollupOptions = {};

if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development') {
	rollupOptions.output = {
		entryFileNames: 'assets/[name].js',
		chunkFileNames: 'assets/[name].js',
		assetFileNames: 'assets/[name][extname]',
	};
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		outDir: './public',
		reportCompressedSize: true,
		chunkSizeWarningLimit: 1600,
		emptyOutDir: false,
		rollupOptions,
	},
	server: {
		hmr: true,
		host: '0.0.0.0',
		port: process.env.VUE_PORT,
		proxy: {
			'/api': {
				target: `http://localhost:${process.env.NODE_PORT}`,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '/api'),
			},
		},
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
