import { createAppleSplashScreens, defineConfig } from '@vite-pwa/assets-generator/config';

export default defineConfig({
    headLinkOptions: {
        preset: '2023',
    },
    preset: {
        transparent: {
            sizes: [], //[64, 192, 512],
            favicons: [], //[[48, 'favicon.ico']],
            resizeOptions: { background: '#FEF752', fit: 'contain' },
        },
        maskable: {
            sizes: [], //[512],
            resizeOptions: { background: '#FEF752', fit: 'contain' },
        },
        apple: {
            sizes: [], //[180],
            resizeOptions: { background: '#FEF752', fit: 'contain' },
        },

        appleSplashScreens: createAppleSplashScreens({
            padding: 0.3,
            resizeOptions: { background: '#FEF752', fit: 'contain' },
            linkMediaOptions: {
                log: true,
                addMediaScreen: true,
                basePath: '/',
                xhtml: false,
            },
            png: {
                compressionLevel: 9,
                quality: 80,
            },
            name: (landscape, size) => {
                return `apple-splash-${landscape ? 'landscape' : 'portrait'}-${size.width}x${size.height}.png`;
            },
        }),
    },
    images: ['public/icon.svg', 'public/logo.svg'],
});
