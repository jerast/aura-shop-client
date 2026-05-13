import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	base: '/',
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@test': path.resolve(__dirname, './test'),
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./test/setup.js'],
		include: ['test/**/*.test.{js,jsx}'],
	},
});
