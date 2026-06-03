/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF8ED',
          100: '#FFE9C5',
          200: '#FFD08A',
          400: '#F5A623',
          600: '#C97D0F',
          900: '#7A4A05',
        },
        accent: {
          100: '#E8F5E2',
          400: '#5BA043',
          700: '#2D5E1E',
        },
        stone: {
          50: '#FAFAF8',
          100: '#F2F1EE',
          300: '#C8C6C0',
          600: '#6B6860',
          900: '#1C1B18',
        },
        danger: '#D94F3D',
        warning: '#E8930A',
        success: '#4A9B6F',
      },
      fontFamily: {
        'inter': ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '20px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
    },
  },
  plugins: [],
};
