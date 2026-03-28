/**
 * Resolves the tab index for a focusable element.
 * Supports roving tabindex pattern for radio groups.
 *
 * @param isFocusable - Whether the element should be focusable
 * @param providedTabIndex - Optional: override tab index
 * @param options - Optional: roving tabindex options
 * @returns The resolved tab index (0 for focusable, -1 for not)
 *
 * @example
 * // Basic usage
 * const tabIndex = resolveTabIndex(true, undefined);
 * // Result: 0
 *
 * @example
 * // Roving tabindex for radio group
 * const tabIndex = resolveTabIndex(isFocusable, undefined, {
 *   isActive: isChecked,
 *   hasActiveItem: groupHasValue,
 * });
 */
export const resolveTabIndex = (
  isFocusable: boolean,
  providedTabIndex?: 0 | -1,
  options?: {
    /**
     * Whether this item is the active/checked one (for roving tabindex).
     */
    isActive?: boolean;
    /**
     * Whether any item in the group is currently active/checked.
     * If false/undefined (no selection), all items should be focusable.
     */
    hasActiveItem?: boolean;
  },
): 0 | -1 | undefined => {
  if (providedTabIndex !== undefined) {
    return providedTabIndex;
  }

  if (options?.isActive !== undefined) {
    if (options.isActive) {
      return 0;
    }
    if (options.hasActiveItem) {
      return -1;
    }
    return undefined;
  }

  return isFocusable ? 0 : -1;
};
