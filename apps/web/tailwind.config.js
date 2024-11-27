const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.neutral,
            green: colors.green,
            red: colors.red,
            indigo: colors.indigo,
            blue: {
                50: '#C1C7DB',
                100: '#B4BBD3',
                200: '#9AA4C4',
                300: '#818DB5',
                400: '#6776A6',
                500: '#546290',
                600: '#455176',
                700: '#363F5C',
                800: '#272E43',
                900: '#181C29',
                950: '#0E1017',
            },
            gold: {
                50: '#FFFCF5',
                100: '#ffebc7',
                200: '#ffdf8f',
                300: '#ffd24d',
                400: '#ffcb1f',
                500: '#f9b806',
                600: '#dea002',
                700: '#b77f06',
                800: '#92680c',
                900: '#785b0d',
                950: '#453802',
            },
        },
        // extend: {
        //     colors: {
        //         'main': {
        //             dark: 'var(--main-dark)',
        //             light: 'var(--main-light)',
        //         },
        //         'primary': {
        //             dark: 'var(--primary-dark)',
        //             light: 'var(--primary-light)',
        //         },
        //         'secondary': {
        //             dark: 'var(--secondary-dark)',
        //             light: 'var(--secondary-light)',
        //         },
        //         'danger': {
        //             dark: 'var(--danger-dark)',
        //             light: 'var(--danger-light)',
        //         },
        //         'highlight': {
        //             dark: 'var(--highlight-dark)',
        //             light: 'var(--highlight-light)',
        //         },
        //         'surface': {
        //             dark: 'var(--surface-dark)',
        //             light: 'var(--surface-light)',
        //         },
        //         'border': {
        //             dark: 'var(--border-dark)',
        //             light: 'var(--border-light)',
        //         },
        //         'accent': {
        //             dark: 'var(--accent-dark)',
        //             // light: 'var(--accent-light)',
        //         },
        //     },
        // },
    },
    plugins: [],
}
