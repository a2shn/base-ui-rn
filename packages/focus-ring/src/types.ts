import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Options for the useFocusRing hook.
 *
 * @property disabled - Whether the component is disabled
 * @property focusableWhenDisabled - Whether the component remains focusable when disabled
 * @property disableDefaultFocusRing - Whether to disable the default focus ring styling
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
}

/**
 * Return value from the useFocusRing hook.
 *
 * @property focused - Whether the component is currently focused
 * @property onFocus - Callback to handle focus events
 * @property onBlur - Callback to handle blur events
 * @property focusRingStyle - The computed focus ring style (null if disabled, default style otherwise)
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
