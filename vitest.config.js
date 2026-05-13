import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./test/setup.js'],
		include: ['test/**/*.test.{js,jsx}'],
		exclude: ['node_modules', 'dist'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			include: ['src/**/*.js', 'src/**/*.jsx'],
			exclude: ['**/index.js', '**/main.jsx', 'src/assets/**'],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@test': path.resolve(__dirname, './test'),
		},
	},
});