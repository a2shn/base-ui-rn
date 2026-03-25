import type { StyleProp, ViewStyle } from 'react-native';

export interface UseFocusRingOptions {
  /**
   * Disable the default focus ring styling.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
}

export interface UseFocusRingReturn {
  /**
   * Whether the component is currently focused.
   */
  focused: boolean;
  /**
   * Whether the focus ring should be visible.
   * Keyboard on web, always on native.
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
   * The focus ring style (null if disabled, default style otherwise).
   */
  focusRingStyle: StyleProp<ViewStyle> | null;
}
