import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Options for the useFocusRing hook.
 *
 * @property disabled - Whether the component is disabled
 * @property focusableWhenDisabled - Whether the component remains focusable when disabled
 * @property disableDefaultFocusRing - Whether to disable the default focus ring styling
 * @property tabIndex - Optional: override tab index
 */
export interface UseFocusRingOptions {
  /**
   * Whether the component is disabled.
   */
  disabled: boolean;
  /**
   * Whether the component remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled: boolean;
  /**
   * Disable the default focus ring styling.
   * @default false
   */
  disableDefaultFocusRing: boolean;
  /**
   * Optional tab index override.
   */
  tabIndex?: 0 | -1;
}

/**
 * Return value from the useFocusRing hook.
 *
 * @property focused - Whether the component is currently focused
 * @property onFocus - Callback to handle focus events
 * @property onBlur - Callback to handle blur events
 * @property focusRingStyle - The computed focus ring style (null if disabled, default style otherwise)
 * @property isFocusable - Whether the component is focusable
 * @property tabIndex - The resolved tab index
 */
export interface UseFocusRingReturn {
  /**
   * Whether the component is currently focused.
   */
  focused: boolean;
  /**
   * Callback to handle focus events.
   */
  onFocus: () => void;
  /**
   * Callback to handle blur events.
   */
  onBlur: () => void;
  /**
   * The focus ring style.
   * Null if the focus ring should not be visible (e.g., disabled or mouse focus on web).
   * Default style from core if focus ring should be visible.
   */
  focusRingStyle: StyleProp<ViewStyle> | null;
  /**
   * Whether the component is focusable.
   */
  isFocusable: boolean;
  /**
   * The resolved tab index.
   */
  tabIndex: 0 | -1;
}

/**
 * State shape for components that use focus ring.
 * Use this type for render function state instead of defining duplicate types.
 *
 * @property focused - Whether the component is currently focused
 */
export interface FocusRingState {
  /**
   * Whether the component is currently focused.
   */
  focused: boolean;
}
