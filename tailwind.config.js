/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            animation: {
                'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
                'spin-slow': 'spin 7s linear infinite',
            },
            colors: {
                brand: {
                    yellow: 'hsl(var(--color-kdp-yellow), <alpha-value>)',
                    'yellow-light': 'hsl(var(--color-kdp-yellow-light), <alpha-value>)',
                    purple: 'hsl(var(--color-kdp-purple), <alpha-value>)',
                    red: 'hsl(var(--color-kdp-red), <alpha-value>)',
                    green: 'hsl(var(--color-kdp-green), <alpha-value>)',
                    'green-alt': 'hsl(var(--color-kdp-green-alt), <alpha-value>)',
                    white: 'hsl(var(--color-kdp-white), <alpha-value>)',
                },
                theme: {
                    50: 'hsl(var(--color-theme-50), <alpha-value>)',
                    100: 'hsl(var(--color-theme-100), <alpha-value>)',
                    200: 'hsl(var(--color-theme-200), <alpha-value>)',
                    300: 'hsl(var(--color-theme-300), <alpha-value>)',
                    400: 'hsl(var(--color-theme-400), <alpha-value>)',
                    500: 'hsl(var(--color-theme-500), <alpha-value>)',
                    600: 'hsl(var(--color-theme-600), <alpha-value>)',
                    700: 'hsl(var(--color-theme-700), <alpha-value>)',
                    800: 'hsl(var(--color-theme-800), <alpha-value>)',
                    900: 'hsl(var(--color-theme-900), <alpha-value>)',
                    950: 'hsl(var(--color-theme-950), <alpha-value>)',
                },
                primary: 'hsl(var(--color-primary), <alpha-value>)',
                alternate: 'hsl(var(--color-alternate), <alpha-value>)',
            },
            screens: {
                xs: '420px',
            },
        },
        fontFamily: {
            /*sans: [
                '-apple-system',
                'system-ui',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
            ],*/
            sans: ['roc-grotesk-variable', 'ui-sans-serif', 'system-ui', 'sans-serif', 'apple-system'],
            mono: [
                'ocr-a-std',
                'ui-monospace',
                'SFMono-Regular',
                'Menlo',
                'Monaco',
                'Consolas',
                'Liberation Mono',
                'Courier New',
                'monospace',
            ],
        },
    },
    plugins: [],
};
