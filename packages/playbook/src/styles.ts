import { StyleSheet } from 'react-native';

/**
 * Border radius scale.
 */
const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

/**
 * Spacing scale.
 */
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

/**
 * Font size and weight scale.
 */
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

/**
 * Light theme color palette.
 */
const colors = {
  bg: '#FFFFFF',
  bgSecondary: '#F5F5F7',
  bgTertiary: '#EBEBED',
  bgCard: '#FFFFFF',
  bgCardHover: '#FAFAFA',
  bgCanvas: '#FAFAFA',
  bgDebug: '#1A1A1A',
  bgDebugHeader: '#242424',
  bgDebugRow: '#1F1F1F',

  border: '#E0E0E5',
  borderLight: '#EBEBED',
  borderCard: '#E5E5EA',
  borderDebug: '#2E2E2E',

  textPrimary: '#0A0A0A',
  textSecondary: '#5A5A65',
  textMuted: '#9898A0',
  textInverted: '#FFFFFF',

  accent: '#0071E3',
  accentMuted: '#E5F0FF',
  accentHover: '#0077ED',

  syntaxKey: '#9CDCFE',
  syntaxValue: '#CE9178',
  syntaxComment: '#6A9955',
  syntaxText: '#D4D4D4',
  syntaxLabel: '#A0A0A0',

  warning: '#FF3B30',
  warningBg: 'rgba(255,59,48,0.07)',

  divider: '#E8E8EC',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowHover: 'rgba(0, 0, 0, 0.12)',

  // State indicator colors
  stateTrue: '#34C759',
  stateFalse: '#FF9500',
  stateTimestamp: '#8E8E93',
};

/**
 * Creates and returns the application StyleSheet.
 */
export function createStyles() {
  const c = colors;

  return StyleSheet.create({
    backButton: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    backButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    backButtonText: {
      color: c.accent,
      fontWeight: font.weight.bold,
      fontSize: font.size.base,
      letterSpacing: -0.1,
    },

    menuList: {
      padding: spacing.xl,
      gap: spacing.lg,
    },
    menuHeaderContainer: {
      marginBottom: spacing.xxl,
    },
    menuHeader: {
      fontSize: font.size.xxxl,
      fontWeight: font.weight.black,
      letterSpacing: -1.2,
      color: c.textPrimary,
      marginBottom: spacing.xs,
    },
    menuSubheader: {
      fontSize: font.size.md,
      fontWeight: font.weight.medium,
      color: c.textSecondary,
      marginBottom: spacing.xxl,
    },

    // Search container
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.bgCard,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: c.borderLight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.xl,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 3,
      elevation: 2,
    },
    searchContainerFocused: {
      borderColor: c.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 4,
    },
    searchIconContainer: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: font.size.base,
      fontWeight: font.weight.medium,
      color: c.textPrimary,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.xs,
    },
    searchClearButton: {
      padding: spacing.xs,
      marginLeft: spacing.xs,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchResultsText: {
      fontSize: font.size.sm,
      fontWeight: font.weight.semibold,
      color: c.textSecondary,
      marginBottom: spacing.md,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // Component list
    componentList: {
      marginBottom: spacing.md,
    },

    // Empty state
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxxl * 2,
      paddingHorizontal: spacing.xl,
    },
    emptyStateIconContainer: {
      marginBottom: spacing.lg,
      opacity: 0.3,
    },
    emptyStateText: {
      fontSize: font.size.xl,
      fontWeight: font.weight.bold,
      color: c.textPrimary,
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    emptyStateSubtext: {
      fontSize: font.size.md,
      color: c.textMuted,
      textAlign: 'center',
    },
    menuCard: {
      backgroundColor: c.bgCard,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderColor: c.borderCard,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 3,
      marginBottom: spacing.md,
      overflow: 'hidden',
      minHeight: 80,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    menuCardPressed: {
      borderColor: c.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
    },
    menuCardIconContainer: {
      position: 'absolute',
      left: spacing.lg,
      top: '50%',
      transform: [{ translateY: -24 }],
    },
    menuCardIconBg: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.accentMuted,
    },
    menuCardContent: {
      paddingVertical: spacing.lg,
      paddingLeft: spacing.lg + 48 + spacing.md,
      paddingRight: spacing.xl + spacing.lg,
    },
    menuCardText: {
      fontSize: font.size.lg,
      fontWeight: font.weight.bold,
      color: c.textPrimary,
      marginBottom: spacing.xs - 2,
      letterSpacing: -0.3,
    },
    menuCardDescription: {
      fontSize: font.size.sm + 1,
      fontWeight: font.weight.medium,
      color: c.textSecondary,
      lineHeight: 18,
    },
    menuCardArrow: {
      position: 'absolute',
      right: spacing.lg,
      top: '50%',
      transform: [{ translateY: -12 }],
      opacity: 0.4,
    },

    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    content: {
      paddingBottom: spacing.xxxl + spacing.xl,
    },
    header: {
      fontSize: font.size.xxl,
      fontWeight: font.weight.heavy,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.sm,
      color: c.textPrimary,
      letterSpacing: -0.5,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.divider,
      marginHorizontal: spacing.xl,
    },

    section: {
      marginTop: spacing.xxl,
      paddingHorizontal: spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: font.size.base,
      fontWeight: font.weight.bold,
      color: c.textPrimary,
      letterSpacing: -0.2,
    },
    sectionDesc: {
      fontSize: font.size.md,
      color: c.textSecondary,
      marginTop: spacing.xs,
      lineHeight: 18,
    },

    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    refreshButton: {
      paddingHorizontal: spacing.sm,
      minWidth: 36,
      alignItems: 'center',
    },
    debugToggle: {
      paddingVertical: spacing.xs + 2,
      paddingHorizontal: spacing.md,
      backgroundColor: c.accent,
      borderRadius: radius.sm,
    },
    debugToggleText: {
      fontSize: font.size.xs + 1,
      fontWeight: font.weight.black,
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },

    canvas: {
      padding: spacing.lg,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.borderLight,
      backgroundColor: c.bgCanvas,
      gap: spacing.md,
    },

    methodRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
    },
    methodLabel: {
      fontSize: font.size.sm,
      color: c.textMuted,
    },
    badge: {
      borderWidth: 1,
      borderRadius: radius.sm - 2,
      paddingHorizontal: spacing.sm - 2,
      paddingVertical: 2,
    },
    badgeText: {
      fontSize: font.size.xs,
      fontWeight: font.weight.bold,
      fontFamily: 'Courier',
    },

    debugTable: {
      marginTop: spacing.xs,
      backgroundColor: c.bgDebug,
      borderRadius: radius.md,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.borderDebug,
    },
    debugHeaderRow: {
      flexDirection: 'row',
      backgroundColor: c.bgDebugHeader,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
    },
    debugHeader: {
      flex: 1,
      color: c.syntaxLabel,
      fontSize: font.size.xs,
      fontWeight: font.weight.bold,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    debugRow: {
      flexDirection: 'row',
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: c.borderDebug,
    },
    debugRowWarning: {
      backgroundColor: c.warningBg,
    },
    debugKey: {
      flex: 1,
      color: c.syntaxKey,
      fontFamily: 'Courier',
      fontSize: font.size.sm + 1,
    },
    debugValue: {
      flex: 1.5,
      color: c.syntaxValue,
      fontFamily: 'Courier',
      fontSize: font.size.sm + 1,
      textAlign: 'right',
    },

    // Compact state indicator
    stateIndicator: {
      marginTop: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      backgroundColor: c.bgSecondary,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: c.borderLight,
      minHeight: 40,
    },
    stateIndicatorLabel: {
      fontSize: font.size.sm,
      fontWeight: font.weight.semibold,
      color: c.textSecondary,
      marginRight: spacing.xs,
    },
    stateIndicatorValue: {
      fontSize: font.size.sm,
      fontWeight: font.weight.bold,
      fontFamily: 'Courier',
    },
    stateIndicatorChange: {
      fontSize: font.size.xs,
      color: c.stateTimestamp,
      fontFamily: 'Courier',
    },
  });
}

/**
 * Returns the application StyleSheet (light theme only).
 *
 * @example
 * ```ts
 * const styles = useStyles();
 * ```
 */
export function useStyles() {
  return createStyles();
}
