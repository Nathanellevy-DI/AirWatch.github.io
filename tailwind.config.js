/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                aviation: {
                    dark: '#0a0e1a',
                    navy: '#0f172a',
                    slate: '#1e293b',
                    accent: '#38bdf8',
                    glow: '#22d3ee',
                    warning: '#fbbf24',
                    danger: '#ef4444',
                    success: '#22c55e',
                }
            },
            animation: {
                'radar-pulse': 'radar-pulse 2s ease-out infinite',
                'slide-up': 'slide-up 0.3s ease-out',
                'slide-down': 'slide-down 0.3s ease-out',
                'fade-in': 'fade-in 0.2s ease-out',
            },
            keyframes: {
                'radar-pulse': {
                    '0%': {
                        transform: 'scale(0.5)',
                        opacity: '0.8',
                        boxShadow: '0 0 0 0 rgba(34, 211, 238, 0.7)'
                    },
                    '70%': {
                        transform: 'scale(2.5)',
                        opacity: '0',
                        boxShadow: '0 0 0 20px rgba(34, 211, 238, 0)'
                    },
                    '100%': {
                        transform: 'scale(0.5)',
                        opacity: '0'
                    }
                },
                'slide-up': {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' }
                },
                'slide-down': {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(100%)' }
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                }
            },
            boxShadow: {
                'glow': '0 0 20px rgba(56, 189, 248, 0.3)',
                'glow-lg': '0 0 40px rgba(56, 189, 248, 0.4)',
            }
        },
    },
    plugins: [],
}
