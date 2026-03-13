import type { ViewProps, StyleProp, ViewStyle } from 'react-native';
import type { WebToggleGroupAccessibilityProps } from '@base-ui-rn/core';
import { type ToggleGroupChangeEventDetails } from '@base-ui-rn/toggle';

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
  /**
   * Whether the group should show a focus ring.
   */
  focusVisible: boolean;
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
}
