/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        pokedex: {
          red: '#CC0000',
          'red-dark': '#990000',
          'red-light': '#FF3333',
          screen: '#9BBC0F',
          'screen-dark': '#0F380F',
          'screen-mid': '#306230',
          gray: '#AAAAAA',
          'gray-dark': '#444444',
          black: '#1a1a1a',
        },
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pixelPulse: {
          '0%, 100%': { boxShadow: '0 0 8px #CC0000, 0 0 20px #CC000066' },
          '50%': { boxShadow: '0 0 20px #CC0000, 0 0 40px #CC000099' },
        },
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
        blink: 'blink 1s step-end infinite',
        fadeIn: 'fadeIn 0.5s ease forwards',
        slideUp: 'slideUp 0.6s ease forwards',
        pixelPulse: 'pixelPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
