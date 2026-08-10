/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF4F0',
          100: '#DCE9E0',
          200: '#B8D3C1',
          300: '#8FB89D',
          400: '#5C9575',
          500: '#2F7A5E',
          600: '#1F5E45',
          700: '#1B4D3E',
          800: '#123328',
          900: '#0D251D',
        },
        gold: {
          50: '#FBF6E7',
          100: '#F3E7C9',
          300: '#DDBB6E',
          400: '#D4A84A',
          500: '#C89B3C',
          600: '#A87D28',
          700: '#8A651E',
        },
        ink: '#1A231E',
        muted: '#63706A',
        paper: '#F2F1EC',
        line: '#E4E7E1',
      },
      fontFamily: {
        display: ['Lexend', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['16px', '1.5'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(26,35,30,0.06), 0 1px 2px -1px rgba(26,35,30,0.06)',
        elevated: '0 10px 25px -5px rgba(26,35,30,0.1), 0 8px 10px -6px rgba(26,35,30,0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1A231E',
            maxWidth: 'none',
            h1: {
              fontFamily: 'Lexend, ui-sans-serif, system-ui, sans-serif',
              fontWeight: '700',
              color: '#1A231E',
            },
            h2: {
              fontFamily: 'Lexend, ui-sans-serif, system-ui, sans-serif',
              fontWeight: '600',
              color: '#1A231E',
            },
            h3: {
              fontFamily: 'Lexend, ui-sans-serif, system-ui, sans-serif',
              fontWeight: '600',
              color: '#1A231E',
            },
            h4: {
              fontFamily: 'Lexend, ui-sans-serif, system-ui, sans-serif',
              fontWeight: '600',
              color: '#1A231E',
            },
            a: {
              color: '#1B4D3E',
              textDecoration: 'underline',
              '&:hover': {
                color: '#1F5E45',
              },
            },
            strong: {
              color: '#1A231E',
              fontWeight: '600',
            },
            'ol > li::marker': {
              color: '#1B4D3E',
              fontWeight: '600',
            },
            'ul > li::marker': {
              color: '#1B4D3E',
            },
            blockquote: {
              borderLeftColor: '#1B4D3E',
              color: '#63706A',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
};
