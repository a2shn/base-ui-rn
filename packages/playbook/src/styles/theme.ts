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
  bg: '#FFFFFF',
  bgSecondary: '#F5F5F5',
  bgCanvas: '#F5F5F5',
  border: '#E0E0E0',
  borderLight: '#EBEBEB',
  textPrimary: '#000000',
  textSecondary: '#666666',
  textMuted: '#999999',
  divider: '#E8E8EC',
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
