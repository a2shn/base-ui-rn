import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Options for the useFocusRing hook.
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
 */
export interface UseFocusRingReturn {
  /**
   * Whether the component is currently focused.
   */
  focused: boolean;
  /**
   * Whether the focus ring should be visible (e.g., keyboard focus on web).
   */
  focusVisible: boolean;
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
   * Null if the focus ring should not be visible.
   */
  focusRingStyle: StyleProp<ViewStyle> | null;
  /**
   * Whether the component is focusable.
   */
  isFocusable: boolean;
}

/**
 * State shape for components that use focus ring.
 */
export interface FocusRingState {
  /**
   * Whether the component is currently focused.
   */
  focused: boolean;
  /**
   * Whether the focus ring should be visible.
   */
  focusVisible: boolean;
}
