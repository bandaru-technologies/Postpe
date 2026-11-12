/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5',
          600: '#1a2456',
          700: '#162048',
          800: '#111c3a',
          900: '#0f1535',
          950: '#0a0f24',
        },
        cyan: {
          400: '#22d3ee',
          500: '#00d4ff',
          600: '#0891b2',
        },
        accent: '#00d4ff',
        'card-bg': '#1a2456',
        'page-bg': '#0f1535',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 212, 255, 0.08)',
        'card-hover': '0 8px 32px rgba(0, 212, 255, 0.18)',
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0f1535 0%, #1a2456 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00d4ff 0%, #1e3a8a 100%)',
        'gradient-card': 'linear-gradient(135deg, #1a2456 0%, #162048 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
