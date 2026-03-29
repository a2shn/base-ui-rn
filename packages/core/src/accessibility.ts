import type { AccessibilityActionInfo, AccessibilityState } from 'react-native';

/**
 * Merges consumer-provided accessibility actions with defaults,
 * deduplicating by action name. Defaults are always included first
 * so consumer actions can extend but not silently remove them.
 */
export const mergeAccessibilityActions = (
  defaults: readonly AccessibilityActionInfo[],
  consumer: readonly AccessibilityActionInfo[] | undefined,
): AccessibilityActionInfo[] => {
  if (!consumer?.length) return [...defaults];

  const seen = new Set(defaults.map((a) => a.name));
  const extras = consumer.filter((a) => !seen.has(a.name));

  return [...defaults, ...extras];
};


/**
 * Merges consumer-provided accessibilityState with computed state.
 * Computed values (disabled) always win over consumer-provided ones
 * since they reflect real component state, not just intent.
 */
export const mergeAccessibilityState = (
  consumer: AccessibilityState | undefined,
  isDisabled: boolean,
): AccessibilityState => {
  return {
    ...consumer,
    disabled: isDisabled,
  };
};
/**
 * Checks if an accessibility action should activate a component.
 * Supports common activation action names across platforms.
 *
 * @param actionName - The accessibility action name
 * @returns True if the action should activate the component
 *
 * @example
 * ```tsx
 * if (isActivationAction(event.nativeEvent.actionName)) {
 *   handleActivate();
 * }
 * ```
 */
export const isActivationAction = (actionName: string): boolean => {
  return (
    actionName === 'activate' ||
    actionName === 'click' ||
    actionName === 'magicTap'
  );
};


