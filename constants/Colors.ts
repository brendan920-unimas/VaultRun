// VaultRun Dark RPG Theme
export const Colors = {
  // Core backgrounds
  background: '#0a0e1a',
  surface: '#141828',
  surfaceLight: '#1e2440',
  surfaceElevated: '#252b48',

  // Primary accents
  primary: '#7f77dd',
  primaryDim: '#5a54a0',
  primaryGlow: 'rgba(127, 119, 221, 0.3)',

  // Secondary accents
  teal: '#1d9e75',
  tealDim: '#167a5a',
  tealGlow: 'rgba(29, 158, 117, 0.3)',

  amber: '#ef9f27',
  amberDim: '#c07f1e',
  amberGlow: 'rgba(239, 159, 39, 0.3)',

  // Semantic
  danger: '#e5475b',
  dangerDim: '#b8384a',
  dangerGlow: 'rgba(229, 71, 91, 0.3)',

  success: '#1d9e75',
  warning: '#ef9f27',

  // Text
  text: '#e8e6f0',
  textSecondary: '#9b98b8',
  textMuted: '#6b6b8d',
  textInverse: '#0a0e1a',

  // Borders
  border: '#2a3055',
  borderLight: '#353d6a',

  // Tab bar
  tabBar: '#0d1120',
  tabBarBorder: '#1a1f35',

  // Gradients
  gradientPurple: ['#7f77dd', '#5a3fd4'] as const,
  gradientTeal: ['#1d9e75', '#0e7a5a'] as const,
  gradientAmber: ['#ef9f27', '#d4801a'] as const,
  gradientDark: ['#141828', '#0a0e1a'] as const,
  gradientCard: ['rgba(30, 36, 64, 0.8)', 'rgba(20, 24, 40, 0.9)'] as const,

  // XP bar colors by level tier
  xpRookie: '#7f77dd',
  xpKnight: '#1d9e75',
  xpWarden: '#ef9f27',
  xpLegend: '#e5475b',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 36,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export default Colors;
