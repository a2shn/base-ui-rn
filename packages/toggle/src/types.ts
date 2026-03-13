import type {
  PressableProps,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  type PressedChangeDetails,
  type KeyPressEventData,
  type WebToggleAccessibilityProps,
} from '@base-ui-rn/core';
import type { ShortcutConfig } from '@base-ui-rn/keyboard-shortcuts';

/**
 * Details passed as the second argument to `onPressedChange`.
 * Describes how the toggle was activated.
 */
export type TogglePressedChangeDetails = PressedChangeDetails;

export interface ToggleState {
  /**
   * Whether the toggle is currently pressed.
   */
  pressed: boolean;
  /**
   * Whether the toggle is currently focused.
   */
  focused: boolean;
  /**
   * Whether the toggle should show a focus ring.
   */
  focusVisible: boolean;
}

export interface ToggleProps
  extends
    Omit<PressableProps, 'role' | 'children' | 'style'>,
    WebToggleAccessibilityProps {
  /**
   * The content of the toggle.
   */
  children?: React.ReactNode | ((state: ToggleState) => React.ReactNode);

  /**
   * Style applied to the toggle view.
   */
  style?: StyleProp<ViewStyle> | ((state: ToggleState) => StyleProp<ViewStyle>);

  /**
   * A unique value for the toggle. Used within a `ToggleGroup`.
   */
  value?: string;

  /**
   * The controlled pressed state of the toggle.
   */
  pressed?: boolean;

  /**
   * The initial pressed state when uncontrolled.
   * @default false
   */
  defaultPressed?: boolean;

  /**
   * Callback fired when the pressed state changes.
   */
  onPressedChange?: (
    pressed: boolean,
    details: TogglePressedChangeDetails,
  ) => void;

  /**
   * The accessibility role of the toggle.
   * @default 'checkbox'
   */
  role?: 'checkbox' | 'switch';

  /**
   * A short hint describing the result of the action.
   * @default 'Toggles the state'
   */
  accessibilityHint?: string;

  /**
   * Whether the toggle remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;

  /**
   * Whether to force the focus-visible state.
   * @default false
   */
  focusVisible?: boolean;

  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;

  /**
   * Callback fired when a key is pressed.
   */
  onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  /**
   * Keyboard shortcut configuration for the toggle.
   */
  shortcut?: ShortcutConfig;

  /**
   * The hit slop of the toggle.
   * @default { top: 14, bottom: 14, left: 14, right: 14 }
   */
  hitSlop?: PressableProps['hitSlop'];
}

// Re-export commonly used types from core
export type {
  KeyPressEventData,
  WebToggleAccessibilityProps,
} from '@base-ui-rn/core';
