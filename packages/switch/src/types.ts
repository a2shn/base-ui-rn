import type {
  PressableProps,
  NativeSyntheticEvent,
  ViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type {
  KeyPressEventData,
  FocusVisibleProps,
  ARIABaseProps,
  ARIAFocusProps,
  ARIALiveProps,
  ARIATraitDisabled,
} from '@base-ui-rn/core';

/**
 * Web-specific accessibility props for Switch Root.
 */
export type WebSwitchRootAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
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
     * Present when the switch is disabled.
     */
    'data-disabled'?: 'true';
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
     * Present when the switch is disabled.
     */
    'data-disabled'?: 'true';
  };

export interface SwitchState {
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
  /**
   * Whether the switch is currently focused.
   */
  focused: boolean;
  /**
   * Whether the switch should show a focus ring.
   */
  focusVisible: boolean;
}

export interface SwitchRootProps
  extends
    Omit<PressableProps, 'children' | 'style'>,
    WebSwitchRootAccessibilityProps,
    FocusVisibleProps {
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
}

export interface SwitchThumbProps
  extends Omit<ViewProps, 'children'>, WebSwitchThumbAccessibilityProps {
  /**
   * The content of the thumb.
   */
  children?: React.ReactNode | ((state: SwitchState) => React.ReactNode);
}

export type { KeyPressEventData };
