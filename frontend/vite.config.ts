import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
			manifest: {
				name: 'Currency Exchange App',
				short_name: 'CurrencyApp',
				description: 'Track currency exchange rates with NBP API',
				theme_color: '#2563eb',
				background_color: '#ffffff',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: '/icons/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/icons/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/api\.nbp\.pl\/api\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'nbp-api-cache',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 2, // 2 hours
							},
						},
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@/components': path.resolve(__dirname, './src/components'),
			'@/hooks': path.resolve(__dirname, './src/hooks'),
			'@/services': path.resolve(__dirname, './src/services'),
			'@/utils': path.resolve(__dirname, './src/utils'),
			'@/types': path.resolve(__dirname, './src/types'),
		},
	},
	server: {
		port: 5173,
		host: true,
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: 'dist',
		sourcemap: true,
	},
});
