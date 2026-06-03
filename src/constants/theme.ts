export const colors = {
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
  white: '#FFFFFF',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#1C1B18',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#1C1B18',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#1C1B18',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const typography = {
  display: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  title: { fontSize: 22, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
  heading: { fontSize: 18, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.2 },
  body: { fontSize: 16, fontFamily: 'Inter_400Regular', lineHeight: 24 },
  bodySm: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium', letterSpacing: 0.2 },
  caption: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  chip: { fontSize: 12, fontFamily: 'Inter_500Medium', letterSpacing: 0.3 },
} as const;

export const avatarColors = [
  '#F5A623', '#5BA043', '#4A90D9', '#D94F3D',
  '#9B59B6', '#E8930A', '#2D5E1E', '#C97D0F',
];
