import { PressableWithKeyDown } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type * as React from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

export type TabValue = string | number;

export type Orientation = 'horizontal' | 'vertical';

export type ActivationDirection = 'left' | 'right' | 'up' | 'down' | 'none';

export interface TabsRootState {
  value: TabValue | null;
  orientation: Orientation;
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
  style?: StyleProp<ViewStyle> | ((state: TabsRootState) => StyleProp<ViewStyle>);
  /**
   * The default value of the active tab when uncontrolled.
   * @default 0
   */
  defaultValue?: TabValue | null;
  /**
   * The controlled value of the active tab. Use with `onValueChange`.
   */
  value?: TabValue | null;
  /**
   * Fired when the active tab changes.
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
   * Fired when keyboard focus changes.
   */
  onFocusChange?: (value: string) => void;
}

export interface TabsListState {
  orientation: Orientation;
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
  style?: StyleProp<ViewStyle> | ((state: TabsListState) => StyleProp<ViewStyle>);
  /**
   * Whether to loop keyboard focus within the tabs list.
   * @default true
   */
  loopFocus?: boolean;
}

export interface TabState extends FocusRingState {
  active: boolean;
  isDisabled: boolean;
  orientation: Orientation;
  activationDirection: ActivationDirection;
}

export interface TabProps extends Omit<React.ComponentProps<typeof PressableWithKeyDown>, 'children' | 'style'> {
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
  orientation: Orientation;
  activationDirection: ActivationDirection;
  tab: {
    height?: number;
    left?: number;
    top?: number;
    width?: number;
  };
}

export interface TabsIndicatorProps extends Omit<ViewProps, 'children' | 'style'> {
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
  style?: StyleProp<ViewStyle> | ((state: TabsIndicatorState) => StyleProp<ViewStyle>);
}

export interface TabPanelState {
  hidden: boolean;
  orientation: Orientation;
  activationDirection: ActivationDirection;
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
  style?: StyleProp<ViewStyle> | ((state: TabPanelState) => StyleProp<ViewStyle>);
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
