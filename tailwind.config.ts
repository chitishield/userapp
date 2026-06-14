import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        display: ['DM Sans', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          mid:     '#1A2E45',
          light:   '#243B55',
        },
        teal: {
          DEFAULT: '#0E7C7B',
          light:   '#E6F4F4',
          mid:     '#B2DFDF',
          glow:    '#14A8A7',
        },
        slate: {
          DEFAULT: '#4A5568',
          light:   '#718096',
        },
        silver: '#F7FAFC',
        // Override default border
        border:  '#E2E8F0',
        'border-dk': '#CBD5E0',
      },
      boxShadow: {
        sm:  '0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.04)',
        DEFAULT: '0 4px 12px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.04)',
        lg:  '0 12px 32px rgba(0,0,0,.10),0 4px 8px rgba(0,0,0,.06)',
        xl:  '0 24px 64px rgba(0,0,0,.14)',
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '6px',
        lg: '14px',
        xl: '18px',
      },
      animation: {
        'fade-in':    'fadeIn .3s ease',
        'slide-up':   'slideUp .3s cubic-bezier(.34,1.56,.64,1)',
        'pulse-red':  'pulseRed 1.5s infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(16px) scale(.97)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        pulseRed: { '0%,100%': { opacity: '1' }, '50%': { opacity: '.3' } },
      },
    },
  },
  plugins: [],
}

export default config
