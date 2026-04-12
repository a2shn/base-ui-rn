import type { StyleProp, ViewStyle } from 'react-native';

export interface UseFocusRingOptions {
  disabled: boolean;
  focusableWhenDisabled: boolean;
  disableDefaultFocusRing: boolean;
}

export interface UseFocusRingReturn {
  focused: boolean;
  focusVisible: boolean;
  onFocus: () => void;
  onBlur: () => void;
  focusRingStyle: StyleProp<ViewStyle> | null;
  isFocusable: boolean;
}

export interface FocusRingState {
  focused: boolean;
  focusVisible: boolean;
}
