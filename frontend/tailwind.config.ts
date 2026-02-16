import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Nairobi-inspired color palette
                'nairobi': {
                    'sunset': '#FF6B35',      // Vibrant orange
                    'teal': '#006D77',         // Deep teal
                    'yellow': '#FFD23F',       // Matatu yellow
                    'charcoal': '#1A1A2E',     // Rich dark bg
                    'sage': '#83C5BE',         // Calming green
                    'coral': '#EE6C4D',        // Warm coral
                },
                'struggle': {
                    'low': '#10B981',          // Easy (green)
                    'medium': '#F59E0B',       // Sweet spot (yellow)
                    'high': '#EF4444',         // Frustrated (red)
                },
            },
            fontFamily: {
                'display': ['Outfit', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
                'handwritten': ['Caveat', 'cursive'],
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-subtle': 'bounce-subtle 2s infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'confetti': 'confetti 0.5s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'bounce-subtle': {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                    },
                    '50%': {
                        transform: 'translateY(-10%)',
                        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                    },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                confetti: {
                    '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'scale(1) rotate(360deg)', opacity: '0' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'nairobi-sunset': 'linear-gradient(135deg, #FF6B35 0%, #EE6C4D 100%)',
                'nairobi-sky': 'linear-gradient(180deg, #006D77 0%, #83C5BE 100%)',
                'struggle-meter': 'linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #EF4444 100%)',
            },
        },
    },
    plugins: [],
};
export default config;
