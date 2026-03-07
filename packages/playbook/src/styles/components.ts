import { StyleSheet } from 'react-native';
import { theme } from './theme';

const { spacing, font, colors, radius } = theme;

export const components = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
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
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
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
    color: colors.textPrimary,
  },
  sectionDesc: {
    fontSize: font.size.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  canvas: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.bgCanvas,
    gap: spacing.md,
  },

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  menuSubheader: {
    fontSize: font.size.md,
    fontWeight: font.weight.medium,
    color: colors.textSecondary,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
  },
  searchContainerFocused: {
    borderColor: colors.textPrimary,
  },
  searchIconContainer: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: font.size.base,
    fontWeight: font.weight.medium,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
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
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  componentList: {
    marginBottom: spacing.md,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyStateText: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: font.size.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
  emptyStateIconContainer: {
    marginBottom: spacing.lg,
    opacity: 0.3,
  },

  componentButton: {
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
    minHeight: 56,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  componentButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  componentButtonContent: {
    flex: 1,
  },
  componentButtonTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.textPrimary,
  },
  componentButtonDescription: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: colors.textSecondary,
    marginTop: 2,
  },
  componentButtonIcon: {
    marginRight: spacing.md,
  },
  componentButtonPressed: {
    backgroundColor: colors.bgSecondary,
  },

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
    color: colors.textPrimary,
    fontWeight: font.weight.bold,
    fontSize: font.size.base,
  },

  debugToggle: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.textPrimary,
    borderRadius: radius.sm,
  },
  debugToggleText: {
    fontSize: font.size.xs + 1,
    fontWeight: font.weight.bold,
    color: colors.bg,
  },

  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  methodLabel: {
    fontSize: font.size.sm,
    color: colors.textMuted,
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
    color: colors.textSecondary,
  },

  debugTable: {
    marginTop: spacing.xs,
    backgroundColor: colors.textPrimary,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  debugHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  debugHeader: {
    flex: 1,
    color: colors.textMuted,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  debugRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderColor: '#333333',
  },
  debugRowWarning: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  debugKey: {
    flex: 1,
    color: '#9CDCFE',
    fontFamily: 'Courier',
    fontSize: font.size.sm + 1,
  },
  debugValue: {
    flex: 1.5,
    color: '#CE9178',
    fontFamily: 'Courier',
    fontSize: font.size.sm + 1,
    textAlign: 'right',
  },

  stateIndicator: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 40,
  },
  stateIndicatorLabel: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  stateIndicatorValue: {
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    fontFamily: 'Courier',
    color: colors.textPrimary,
  },
  stateIndicatorChange: {
    fontSize: font.size.xs,
    color: colors.textMuted,
    fontFamily: 'Courier',
  },
});
