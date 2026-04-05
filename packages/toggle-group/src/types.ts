import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

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
   * The orientation of the group.
   */
  orientation: 'horizontal' | 'vertical';
}

export interface ToggleGroupProps extends Omit<
  ViewProps,
  'children' | 'style'
> {
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
  onValueChange?: (value: string[]) => void;

  /**
   * Callback fired when keyboard focus changes to a different item.
   */
  onFocusChange?: (value: string) => void;

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
