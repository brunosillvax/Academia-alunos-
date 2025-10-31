/******** @type {import('tailwindcss').Config} ********/
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C5DD3',
          light: '#8E59FF',
          dark: '#5A4BC2',
        },
        accent: {
          success: '#0EAD69',
          warning: '#FFA756',
          danger: '#FF6A55',
          info: '#6C5DD3',
        },
        // Variáveis para tema escuro (usar CSS vars quando disponível)
        dark: {
          DEFAULT: '#0b0f19',
          card: '#121826',
          sidebar: '#0e1422',
          border: '#1f2937',
          hover: '#1a1f2e',
        },
        text: {
          primary: '#e5e7eb',
          secondary: '#9ca3af',
        },
        surface: {
          muted: '#F3F4F6',
          mutedHover: '#E5E7EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
