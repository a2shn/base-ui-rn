import type {
  ARIABaseProps,
  ARIALiveProps,
  ARIATraitDisabled,
  KeyPressEventData,
} from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type {
  NativeSyntheticEvent,
  PressableProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * Web-specific accessibility props for Switch Root.
 */
export type WebSwitchRootAccessibilityProps = ARIABaseProps &
  ARIATraitDisabled & {
    /**
     * Reflects checked state for the ARIA switch pattern on web.
     */
    'aria-checked'?: boolean | 'mixed';
    /**
     * Reflects read-only state for the ARIA switch pattern on web.
     */
    'aria-readonly'?: boolean;
    /**
     * Custom data attribute applied on web for CSS selectors and testing.
     * Reflects the current checked state.
     */
    'data-checked'?: 'true';
    /**
     * Custom data attribute applied on web for CSS selectors and testing.
     * Reflects the current unchecked state.
     */
    'data-unchecked'?: 'true';
    /**
     * Present when the switch is disabled.
     */
    'data-disabled'?: 'true';
    /**
     * Present when the switch is readonly.
     */
    'data-readonly'?: 'true';
    /**
     * Defines a keyboard shortcut that activates or focuses the element.
     */
    'aria-keyshortcuts'?: string;
  };

/**
 * Web-specific accessibility props for Switch Thumb.
 */
export type WebSwitchThumbAccessibilityProps = ARIABaseProps &
  ARIALiveProps &
  ARIATraitDisabled & {
    /**
     * Custom data attribute applied on web for CSS selectors and testing.
     * Reflects the current checked state.
     */
    'data-checked'?: 'true';
    /**
     * Custom data attribute applied on web for CSS selectors and testing.
     * Reflects the current unchecked state.
     */
    'data-unchecked'?: 'true';
    /**
     * Present when the switch is disabled.
     */
    'data-disabled'?: 'true';
    /**
     * Present when the switch is readonly.
     */
    'data-readonly'?: 'true';
  };

export interface SwitchState extends FocusRingState {
  /**
   * Whether the switch is currently checked.
   */
  checked: boolean;
  /**
   * Whether the switch is disabled.
   */
  disabled: boolean;
  /**
   * Whether the switch is read-only.
   */
  readOnly: boolean;
}

export interface SwitchRootProps
  extends
    Omit<PressableProps, 'role' | 'children' | 'style' | 'aria-checked'>,
    WebSwitchRootAccessibilityProps {
  /**
   * Identifies the field when a form is submitted.
   */
  name?: string;

  /**
   * The value submitted with the form when the switch is on.
   * By default, switch submits the "on" value, matching native checkbox behavior.
   */
  value?: string;

  /**
   * The value submitted with the form when the switch is off.
   * By default, unchecked switches do not submit any value, matching native checkbox behavior.
   */
  uncheckedValue?: string;

  /**
   * The content of the switch root.
   */
  children?: React.ReactNode | ((state: SwitchState) => React.ReactNode);

  /**
   * Style applied to the switch view.
   */
  style?: StyleProp<ViewStyle> | ((state: SwitchState) => StyleProp<ViewStyle>);

  /**
   * The controlled checked state of the switch.
   */
  checked?: boolean;

  /**
   * The initial checked state when uncontrolled.
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Callback fired when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Whether the switch is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the switch is read-only.
   * @default false
   */
  readOnly?: boolean;

  /**
   * Callback fired when a key is pressed down.
   */
  onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  /**
   * Disable the default focus ring styling.
   * @default false
   */
  disableDefaultFocusRing?: boolean;

  /**
   * Whether the switch remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
}

export interface SwitchThumbProps
  extends
    Omit<ViewProps, 'style' | 'children'>,
    WebSwitchThumbAccessibilityProps {
  /**
   * The content of the thumb.
   */
  children?: React.ReactNode | ((state: SwitchState) => React.ReactNode);

  /**
   * Style applied to the thumb view.
   */
  style?: StyleProp<ViewStyle> | ((state: SwitchState) => StyleProp<ViewStyle>);
}

export type { KeyPressEventData };
