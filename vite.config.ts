import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';
import solidSvg from 'vite-plugin-solid-svg';

export default defineConfig({
    plugins: [
        solid(),
        solidSvg(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,svg,gif,json}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/saegewerk-festival\.de\/site\/assets\/files\/.*/i,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'artist-images',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 30 * 24 * 60 * 60,
                            },
                            cacheableResponse: {
                                statuses: [200],
                            },
                            rangeRequests: true,
                        },
                    },
                ],
            },
            devOptions: {
                enabled: true,
            },
            manifest: {
                name: 'Sägewerk 24',
                short_name: 'Sägewerk 24',
                description: '',
                theme_color: '#FEF752',
                background_color: '#FEF752',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'icon-64x64.png',
                        sizes: '64x64',
                        type: 'image/png',
                    },
                    {
                        src: 'icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
        }),
    ],
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
});
