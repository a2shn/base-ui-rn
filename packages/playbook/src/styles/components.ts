import { StyleSheet } from 'react-native';

import { theme } from './theme';

const { colors, font, radius, spacing } = theme;

export const components = StyleSheet.create({
  backButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backButtonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },

  backButtonText: {
    color: colors.textPrimary,
    fontSize: font.size.base,
    fontWeight: font.weight.bold,
  },
  badge: {
    borderRadius: radius.sm - 2,
    borderWidth: 1,
    paddingHorizontal: spacing.sm - 2,
    paddingVertical: 2,
  },

  badgeText: {
    color: colors.textSecondary,
    fontFamily: 'Courier',
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  canvas: {
    backgroundColor: colors.bgCanvas,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  componentButton: {
    backgroundColor: colors.bgSecondary,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    minHeight: 56,
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  componentButtonContent: {
    flex: 1,
  },

  componentButtonDescription: {
    color: colors.textSecondary,
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    marginTop: 2,
  },

  componentButtonIcon: {
    marginRight: spacing.md,
  },
  componentButtonInner: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  componentButtonPressed: {
    backgroundColor: colors.bgCanvas,
  },
  componentButtonTitle: {
    color: colors.textPrimary,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
  },

  componentList: {
    marginBottom: spacing.md,
  },
  container: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxxl + spacing.xl,
  },
  debugHeader: {
    color: colors.textMuted,
    flex: 1,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  debugHeaderRow: {
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  debugKey: {
    color: '#9CDCFE',
    flex: 1,
    fontFamily: 'Courier',
    fontSize: font.size.sm + 1,
  },

  debugRow: {
    borderColor: '#333333',
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },

  debugRowWarning: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  debugTable: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  debugToggle: {
    backgroundColor: colors.textPrimary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  debugToggleText: {
    color: colors.bg,
    fontSize: font.size.xs + 1,
    fontWeight: font.weight.bold,
  },

  debugValue: {
    color: '#CE9178',
    flex: 1.5,
    fontFamily: 'Courier',
    fontSize: font.size.sm + 1,
    textAlign: 'right',
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginHorizontal: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl * 2,
  },
  emptyStateIconContainer: {
    marginBottom: spacing.lg,
    opacity: 0.3,
  },
  emptyStateSubtext: {
    color: colors.textMuted,
    fontSize: font.size.md,
    textAlign: 'center',
  },
  emptyStateText: {
    color: colors.textPrimary,
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  header: {
    color: colors.textPrimary,
    fontSize: font.size.xxl,
    fontWeight: font.weight.heavy,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },

  menuHeader: {
    color: colors.textPrimary,
    fontSize: font.size.xxxl,
    fontWeight: font.weight.black,
    marginBottom: spacing.xs,
  },
  menuHeaderContainer: {
    marginBottom: spacing.xxl,
  },
  menuList: {
    gap: spacing.lg,
    padding: spacing.xl,
  },

  menuSubheader: {
    color: colors.textSecondary,
    fontSize: font.size.md,
    fontWeight: font.weight.medium,
  },
  methodLabel: {
    color: colors.textMuted,
    fontSize: font.size.sm,
  },

  methodRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  searchClearButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchContainerFocused: {
    borderColor: colors.textPrimary,
  },

  searchIconContainer: {
    marginRight: spacing.sm,
  },
  searchInput: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: font.size.base,
    fontWeight: font.weight.medium,
    paddingVertical: spacing.xs,
  },
  searchResultsText: {
    color: colors.textSecondary,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  section: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  sectionDesc: {
    color: colors.textSecondary,
    fontSize: font.size.md,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: font.size.base,
    fontWeight: font.weight.bold,
  },

  stateIndicator: {
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.md,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  stateIndicatorChange: {
    color: colors.textMuted,
    fontFamily: 'Courier',
    fontSize: font.size.xs,
  },
  stateIndicatorLabel: {
    color: colors.textSecondary,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    marginRight: spacing.xs,
  },
  stateIndicatorValue: {
    color: colors.textPrimary,
    fontFamily: 'Courier',
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
  },
});
