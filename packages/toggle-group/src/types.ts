import type { ViewProps, ViewStyle, StyleProp } from 'react-native';
import {
  type ToggleGroupChangeEventDetails,
  type Orientation,
} from '@base-ui-rn/toggle';

export type { Orientation, ToggleGroupChangeEventDetails };

export interface ToggleGroupState {
  /**
   * The value of the toggle group.
   */
  value: string[];
  /**
   * Whether the toggle group is disabled.
   */
  disabled: boolean;
  /**
   * Whether the toggle group allows multiple selection.
   */
  multiple: boolean;
  /**
   * The orientation of the toggle group.
   */
  orientation: Orientation;
  /**
   * Whether to loop keyboard focus back to the first item.
   */
  loopFocus: boolean;
}

export interface ToggleGroupProps extends Omit<
  ViewProps,
  'style' | 'children'
> {
  /**
   * The open state of the toggle group represented by an array of the values of all pressed toggle buttons.
   * This is the uncontrolled counterpart of value.
   */
  defaultValue?: string[];
  /**
   * The open state of the toggle group represented by an array of the values of all pressed toggle buttons.
   * This is the controlled counterpart of defaultValue.
   */
  value?: string[];
  /**
   * Callback fired when the pressed states of the toggle group changes.
   */
  onValueChange?: (
    groupValue: string[],
    eventDetails: ToggleGroupChangeEventDetails,
  ) => void;
  /**
   * Whether to loop keyboard focus back to the first item when the end of the list is reached while using the arrow keys.
   * @default true
   */
  loopFocus?: boolean;
  /**
   * When false only one item in the group can be pressed. If any item in the group becomes pressed, the others will become unpressed.
   * When true multiple items can be pressed.
   * @default false
   */
  multiple?: boolean;
  /**
   * Whether the toggle group should ignore user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * The orientation of the toggle group.
   * @default 'horizontal'
   */
  orientation?: Orientation;
  /**
   * Style applied to the element, or a function that returns a style based on the component’s state.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ToggleGroupState) => StyleProp<ViewStyle>);
  children?: React.ReactNode | ((state: ToggleGroupState) => React.ReactNode);
}
