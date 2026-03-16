import type {
  PressableProps,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  type PressedChangeDetails,
  type KeyPressEventData,
  type FocusVisibleProps,
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIALiveProps,
  type ARIATraitDisabled,
  type ARIATraitExpanded,
} from '@base-ui-rn/core';
import type { ShortcutConfig } from '@base-ui-rn/keyboard-shortcuts';

/**
 * Details passed to `onPressedChange` callback.
 * Describes how the button was activated.
 */
export type ButtonPressedChangeDetails = PressedChangeDetails;

/**
 * Web-specific accessibility props for Button.
 */
export type WebButtonAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitExpanded;

export interface ButtonState {
  /**
   * Whether the button is currently pressed.
   */
  pressed: boolean;
  /**
   * Whether the button is currently focused.
   */
  focused: boolean;
  /**
   * Whether the button should show a focus ring.
   */
  focusVisible: boolean;
}

export interface ButtonProps
  extends
    Omit<PressableProps, 'children' | 'style'>,
    WebButtonAccessibilityProps,
    FocusVisibleProps {
  /**
   * The content of the button.
   */
  children?: React.ReactNode | ((state: ButtonState) => React.ReactNode);

  /**
   * Style applied to the button view.
   */
  style?: StyleProp<ViewStyle> | ((state: ButtonState) => StyleProp<ViewStyle>);

  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;

  /**
   * A short hint describing the result of the action.
   * @default 'Activates the button'
   */
  accessibilityHint?: string;

  /**
   * Callback fired when the pressed state changes.
   */
  onPressedChange?: (details: ButtonPressedChangeDetails) => void;

  /**
   * Callback fired when a key is pressed.
   */
  onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  /**
   * Keyboard shortcut configuration for the button.
   */
  shortcut?: ShortcutConfig;

  /**
   * The hit slop of the button.
   * @default { top: 10, bottom: 10, left: 10, right: 10 }
   */
  hitSlop?: PressableProps['hitSlop'];
}

export type { KeyPressEventData };
