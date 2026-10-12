/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const artifact = process.env.ARTIFACT === '1';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    !artifact && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Laboratório Musical',
        short_name: 'Lab Musical',
        description: 'Teoria musical para piano pela lógica: círculo das quintas, escalas, intervalos, acordes e progressões.',
        lang: 'pt-BR',
        theme_color: '#4F46E5',
        background_color: '#F7F8FC',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tonejs\.github\.io\/audio\/salamander\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'piano-samples', expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'fonts', expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  build: artifact
    ? { outDir: 'dist-artifact', assetsInlineLimit: 1e7, rollupOptions: { output: { inlineDynamicImports: true } } }
    : { rollupOptions: { output: { manualChunks: { tone: ['tone'], react: ['react', 'react-dom'] } } } },
  resolve: artifact ? { alias: { 'virtual:pwa-register': '/src/pwa-stub.ts' } } : undefined,
  test: { environment: 'node', include: ['src/**/*.test.{ts,tsx}'] },
});
