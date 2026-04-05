import { PressableWithKeyDown } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type * as React from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

export type TabValue = string | number;

/**
 * The layout orientation of the tabs.
 */
export type Orientation = 'horizontal' | 'vertical';

/**
 * The direction of tab activation on arrow key press.
 */
export type ActivationDirection = 'left' | 'right' | 'up' | 'down' | 'none';

export interface TabsRootState {
  /**
   * The value of the currently active tab.
   */
  value: TabValue | null;
  /**
   * The orientation of the tabs.
   */
  orientation: Orientation;
  /**
   * The direction of activation on arrow key press.
   */
  activationDirection: ActivationDirection;
}

export interface TabsRootProps extends Omit<ViewProps, 'children' | 'style'> {
  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the component remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * The content of the tabs.
   */
  children?: React.ReactNode | ((state: TabsRootState) => React.ReactNode);
  /**
   * Style applied to the root view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: TabsRootState) => StyleProp<ViewStyle>);
  /**
   * The default value of the active tab when uncontrolled.
   * @default 0
   */
  defaultValue?: TabValue | null;
  /**
   * The controlled value of the active tab.
   */
  value?: TabValue | null;
  /**
   * Callback fired when the active tab changes.
   */
  onValueChange?: (value: TabValue | null) => void;
  /**
   * The layout orientation of the tabs.
   * @default 'horizontal'
   */
  orientation?: Orientation;
  /**
   * Whether to automatically change the active tab on arrow key focus.
   * @default false
   */
  activateOnFocus?: boolean;
  /**
   * Callback fired when keyboard focus changes.
   */
  onFocusChange?: (value: string) => void;
}

export interface TabsListState {
  /**
   * The orientation of the tabs list.
   */
  orientation: Orientation;
  /**
   * The activation direction of the tabs.
   */
  activationDirection: ActivationDirection;
}

export interface TabsListProps extends Omit<ViewProps, 'children' | 'style'> {
  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the component remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * The content of the tabs list.
   */
  children?: React.ReactNode | ((state: TabsListState) => React.ReactNode);
  /**
   * Style applied to the list view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: TabsListState) => StyleProp<ViewStyle>);
  /**
   * Whether to loop keyboard focus within the tabs list.
   * @default true
   */
  loopFocus?: boolean;
}

export interface TabState extends FocusRingState {
  /**
   * Whether the tab is currently active/selected.
   */
  active: boolean;
  /**
   * Whether the tab is disabled.
   */
  isDisabled: boolean;
  /**
   * The orientation of the tabs.
   */
  orientation: Orientation;
  /**
   * The direction of activation on arrow key press.
   */
  activationDirection: ActivationDirection;
}

export interface TabProps extends Omit<
  React.ComponentProps<typeof PressableWithKeyDown>,
  'children' | 'style'
> {
  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the component remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * The content of the tab.
   */
  children?: React.ReactNode | ((state: TabState) => React.ReactNode);
  /**
   * Style applied to the tab view.
   */
  style?: StyleProp<ViewStyle> | ((state: TabState) => StyleProp<ViewStyle>);
  /**
   * The unique value of the tab.
   */
  value: TabValue;
  /**
   * Whether the tab is disabled.
   * @default false
   */
  disabled?: boolean;
}

export interface TabsIndicatorState {
  /**
   * The orientation of the indicator.
   */
  orientation: Orientation;
  /**
   * The activation direction of the tabs.
   */
  activationDirection: ActivationDirection;
  /**
   * The dimensions of the active tab.
   */
  tab: {
    /**
     * The height of the active tab.
     */
    height?: number;
    /**
     * The left position of the active tab.
     */
    left?: number;
    /**
     * The top position of the active tab.
     */
    top?: number;
    /**
     * The width of the active tab.
     */
    width?: number;
  };
}

export interface TabsIndicatorProps extends Omit<
  ViewProps,
  'children' | 'style'
> {
  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the component remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * The content of the indicator.
   */
  children?: React.ReactNode | ((state: TabsIndicatorState) => React.ReactNode);
  /**
   * Style applied to the indicator view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: TabsIndicatorState) => StyleProp<ViewStyle>);
}

export interface TabPanelState {
  /**
   * Whether the panel is currently hidden.
   */
  hidden: boolean;
  /**
   * The orientation of the parent tabs.
   */
  orientation: Orientation;
  /**
   * The activation direction of the tabs.
   */
  activationDirection: ActivationDirection;
  /**
   * The index of the tab panel in the list.
   */
  index: number;
}

export interface TabPanelProps extends Omit<ViewProps, 'children' | 'style'> {
  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the component remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * The content of the panel.
   */
  children?: React.ReactNode | ((state: TabPanelState) => React.ReactNode);
  /**
   * Style applied to the panel view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: TabPanelState) => StyleProp<ViewStyle>);
  /**
   * The value of the tab this panel corresponds to.
   */
  value: TabValue;
  /**
   * Whether to keep the panel mounted when hidden.
   * @default false
   */
  keepMounted?: boolean;
}
