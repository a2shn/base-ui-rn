import {
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIATraitDisabled,
  type KeyPressEventData,
  type PressedChangeDetails,
} from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type { ShortcutConfig } from '@base-ui-rn/keyboard-shortcuts';
import type {
  NativeSyntheticEvent,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

/**
 * Details passed as the second argument to `onPressedChange`.
 * Describes how the toggle was activated.
 */
export type TogglePressedChangeDetails = PressedChangeDetails;

/**
 * Web-specific accessibility and interactivity props for Toggle.
 */
export type WebToggleAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIATraitDisabled & {
    /**
     * Reflects pressed state for the ARIA button-toggle pattern on web.
     * Automatically set when using role="button".
     */
    'aria-pressed'?: boolean | 'mixed';
    /**
     * Custom data attribute applied on web for CSS selectors and testing.
     * Reflects the current pressed state.
     *
     * @example
     * [data-pressed="true"] { background: blue; }
     */
    'data-pressed'?: boolean;
  };

export interface ToggleState extends FocusRingState {
  /**
   * Whether the toggle is currently pressed.
   */
  pressed: boolean;
}

export interface ToggleProps
  extends
    Omit<PressableProps, 'role' | 'children' | 'style' | 'aria-pressed'>,
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
   * Callback fired when a key is pressed down.
   */
  onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  /**
   * Keyboard shortcut configuration for the toggle.
   */
  shortcut?: ShortcutConfig;

  /**
   * The hit slop of the toggle.
   * @default { top: 14, bottom: 14, left: 14, right: 14 }
   */
  hitSlop?: PressableProps['hitSlop'];

  /**
   * Disable the default focus ring styling.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
}
