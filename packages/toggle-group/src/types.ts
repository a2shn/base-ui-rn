import {
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIALiveProps,
  type ARIATraitDisabled,
  type ARIATraitOrientation,
} from '@base-ui-rn/core';
import { type ToggleGroupChangeEventDetails } from '@base-ui-rn/toggle';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

/**
 * Web-specific accessibility props for ToggleGroup.
 */
export type WebToggleGroupAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitOrientation & {
    /**
     * Indicates the orientation of the toggle group.
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Present when the toggle group is disabled.
     */
    'data-disabled'?: boolean;
    /**
     * Present when the toggle group allows multiple buttons to be in the pressed state at the same time.
     */
    'data-multiple'?: boolean;
  };

export interface ToggleGroupState {
  /**
   * The current values of the pressed toggles.
   */
  value: string[];
  /**
   * Whether the group is disabled.
   */
  disabled: boolean;
  /**
   * Whether multiple toggles can be pressed.
   */
  multiple: boolean;
  /**
   * The orientation of the group.
   */
  orientation: 'horizontal' | 'vertical';
  /**
   * Whether keyboard focus should loop.
   */
  loopFocus: boolean;
  /**
   * Whether the group is currently focused.
   */
  focused: boolean;
}

export interface ToggleGroupProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebToggleGroupAccessibilityProps {
  /**
   * The controlled value of the toggle group.
   */
  value?: string[];

  /**
   * The default value of the toggle group when uncontrolled.
   */
  defaultValue?: string[];

  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (
    value: string[],
    details: ToggleGroupChangeEventDetails,
  ) => void;

  /**
   * Whether multiple items can be pressed at once.
   * @default false
   */
  multiple?: boolean;

  /**
   * Whether the group is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * The layout orientation of the group.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Whether keyboard focus should loop within the group.
   * @default true
   */
  loopFocus?: boolean;

  /**
   * Callback fired when keyboard focus changes.
   */
  onFocusChange?: (value: string | null) => void;

  /**
   * The content of the toggle group.
   */
  children?: React.ReactNode | ((state: ToggleGroupState) => React.ReactNode);

  /**
   * Style applied to the group view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ToggleGroupState) => StyleProp<ViewStyle>);
}
