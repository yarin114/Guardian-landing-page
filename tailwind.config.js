/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heebo': ['Heebo', 'sans-serif'],
      },
      colors: {
        clinical: {
          soft: '#E8F4F8',
          primary: '#4A90A4',
          secondary: '#7FB3C3',
          accent: '#A8D5E2',
        },
        guardian: {
          navy: '#0D1B2A',
          dark: '#162033',
          card: '#1A2840',
          teal: '#4A90A4',
          'teal-light': '#7FB3C3',
          'teal-glow': 'rgba(74, 144, 164, 0.15)',
          soft: '#E8F4F8',
          gold: '#F59E0B',
          red: '#EF4444',
          'red-dim': 'rgba(239, 68, 68, 0.12)',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(74,144,164,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(74,144,164,0.6)' },
        }
      }
    },
  },
  plugins: [],
}
