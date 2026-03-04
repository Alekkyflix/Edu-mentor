import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Gemini-standard dark palette (mirrors CSS vars)
                'gem-base':    '#1e1f20',
                'gem-surface': '#282a2c',
                'gem-hover':   '#303236',
                'gem-active':  '#35383c',
                'gem-accent':  '#8ab4f8',
                'gem-green':   '#81c995',
                'gem-red':     '#f28b82',
                'gem-brand':   '#4285f4',

                // EduMentor gamification colours
                'xp-gold':       '#FFD23F',
                'streak-orange': '#FF6B35',
                'struggle-low':  '#34D399',
                'struggle-mid':  '#FBBF24',
                'struggle-high': '#F87171',
            },
            fontFamily: {
                'sans':    ['Inter', '-apple-system', 'sans-serif'],
                'display': ['Outfit', 'Inter', 'sans-serif'],
                'google':  ['"Google Sans"', 'Outfit', 'Inter', 'sans-serif'],
            },
            animation: {
                'shimmer':     'shimmer 2s linear infinite',
                'gem-bounce':  'gemBounce 1.2s infinite',
            },
            keyframes: {
                shimmer: {
                    '0%':   { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                gemBounce: {
                    '0%, 80%, 100%': { transform: 'translateY(0)',  opacity: '0.5' },
                    '40%':           { transform: 'translateY(-6px)', opacity: '1'   },
                },
            },
        },
    },
    plugins: [],
};
export default config;
