import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#eb0f0f',
          hover: '#d00d0d',
          soft: '#ffeceb',
          text: '#e00b0b',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#f2f2f4',
          3: '#fff3f2',
        },
        ink: {
          DEFAULT: '#1d1d1f',
          2: '#424245',
          3: '#6e6e73',
        },
        ok: {
          DEFAULT: '#1a8a4a',
          soft: '#e4f6ea',
        },
        sub: {
          DEFAULT: '#c9a032',
          ink: '#1d1d1f',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '14px',
        sm: '9px',
      },
    },
  },
  plugins: [],
};

export default config;
