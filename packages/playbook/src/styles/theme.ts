import { StyleSheet } from 'react-native';

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

const font = {
  size: {
    xs: 10,
    sm: 11,
    md: 13,
    base: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 34,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
    black: '900',
  },
} as const;

const colors = {
  bg: '#000000',
  bgSecondary: '#0D0D0D',
  bgCanvas: '#1A1A1A',
  border: '#2E2E2E',
  borderLight: '#252525',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',
  divider: '#252525',
} as const;

const radius = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

export const theme = {
  spacing,
  font,
  colors,
  radius,
  border: StyleSheet.hairlineWidth,
};

export type Theme = typeof theme;
