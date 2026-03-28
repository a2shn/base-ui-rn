import type { AccessibilityActionInfo } from 'react-native';

/**
 * Merges accessibility actions, ensuring 'activate' is always present.
 * If 'activate' already exists in the provided actions, returns them as-is.
 * Otherwise, appends the 'activate' action.
 *
 * @param actions - The accessibility actions to merge
 * @returns An array of accessibility actions with 'activate' guaranteed
 *
 * @example
 * ```tsx
 * const merged = mergeAccessibilityActions([{ name: 'longPress' }]);
 * // Result: [{ name: 'longPress' }, { name: 'activate' }]
 * ```
 */
export const mergeAccessibilityActions = (
  actions: ReadonlyArray<AccessibilityActionInfo> | undefined,
): ReadonlyArray<AccessibilityActionInfo> => {
  const actionsList = actions ?? [];
  const hasActivate = actionsList.some((action) => action.name === 'activate');

  return hasActivate ? actionsList : [...actionsList, { name: 'activate' }];
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

/**
 * Merges accessibility state with computed values like disabled and checked/pressed.
 *
 * @param accessibilityState - The base accessibility state
 * @param disabled - Whether the component is disabled
 * @param checked - Optional: whether the component is checked/pressed (for toggles)
 * @returns The merged accessibility state
 *
 * @example
 * ```tsx
 * const merged = mergeAccessibilityState({ label: 'Power' }, false, true);
 * // Result: { label: 'Power', disabled: false, checked: true }
 * ```
 */
export const mergeAccessibilityState = (
  accessibilityState: Record<string, unknown> | undefined,
  disabled: boolean,
  checked?: boolean | 'mixed',
): Record<string, unknown> => {
  const state: Record<string, unknown> = { ...accessibilityState, disabled };

  if (checked !== undefined) {
    state.checked = checked;
  }

  return state;
};

/**
 * Resolves the aria-disabled attribute value.
 * Returns the provided override or defaults to the disabled state.
 *
 * @param disabled - Whether the component is disabled
 * @param providedAriaDisabled - Optional: override aria-disabled value
 * @returns The resolved aria-disabled value
 *
 * @example
 * ```tsx
 * const ariaDisabled = resolveAriaDisabled(isDisabled, props['aria-disabled']);
 * ```
 */
export const resolveAriaDisabled = (
  disabled: boolean,
  providedAriaDisabled?: boolean,
): boolean => {
  return providedAriaDisabled ?? disabled;
};

/**
 * Resolves the aria-pressed attribute value for button-toggle patterns.
 * Returns the provided override or defaults to the pressed state.
 *
 * @param pressed - Whether the component is pressed/toggled
 * @param providedAriaPressed - Optional: override aria-pressed value
 * @returns The resolved aria-pressed value
 *
 * @example
 * ```tsx
 * const ariaPressed = resolveAriaPressed(isPressed, props['aria-pressed']);
 * ```
 */
export const resolveAriaPressed = (
  pressed: boolean,
  providedAriaPressed?: boolean | 'mixed',
): boolean | 'mixed' => {
  return providedAriaPressed ?? pressed;
};

/**
 * Resolves the data-pressed attribute value for CSS selectors.
 * Returns the provided override or defaults to the pressed state.
 *
 * @param pressed - Whether the component is pressed/toggled
 * @param providedDataPressed - Optional: override data-pressed value
 * @returns The resolved data-pressed value
 *
 * @example
 * ```tsx
 * const dataPressed = resolveDataPressed(isPressed, props['data-pressed']);
 * // Can be used in CSS: [data-pressed="true"] { ... }
 * ```
 */
export const resolveDataPressed = (
  pressed: boolean,
  providedDataPressed?: boolean,
): boolean => {
  return providedDataPressed ?? pressed;
};
