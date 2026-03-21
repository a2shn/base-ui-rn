import { StyleSheet } from 'react-native';

const spacing = {
  lg: 16,
  md: 12,
  sm: 8,
  xl: 20,
  xs: 4,
  xxl: 28,
  xxxl: 40,
} as const;

const font = {
  size: {
    base: 16,
    lg: 18,
    md: 13,
    sm: 11,
    xl: 22,
    xs: 10,
    xxl: 28,
    xxxl: 34,
  },
  weight: {
    black: '900',
    bold: '700',
    heavy: '800',
    medium: '500',
    regular: '400',
    semibold: '600',
  },
} as const;

const colors = {
  bg: '#000000',
  bgCanvas: '#1A1A1A',
  bgSecondary: '#0D0D0D',
  border: '#2E2E2E',
  borderLight: '#252525',
  divider: '#252525',
  textMuted: '#666666',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
} as const;

const radius = {
  lg: 12,
  md: 8,
  sm: 4,
} as const;

export const theme = {
  border: StyleSheet.hairlineWidth,
  colors,
  font,
  radius,
  spacing,
};

export type Theme = typeof theme;
