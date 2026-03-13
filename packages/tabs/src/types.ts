import type * as React from 'react';
import type {
  ViewProps,
  PressableProps,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';
import {
  type KeyPressEventData,
  type WebAccessibilityProps,
} from '@base-ui-rn/core';

export type TabValue = string | number;
export type Orientation = 'horizontal' | 'vertical';
export type ActivationDirection = 'left' | 'right' | 'up' | 'down' | 'none';

export interface TabsRootState {
  value: TabValue | null;
  orientation: Orientation;
  activationDirection: ActivationDirection;
}

export interface TabsRootProps extends ViewProps, WebAccessibilityProps {
  /**
   * The content of the tabs.
   */
  children?: React.ReactNode | ((state: TabsRootState) => React.ReactNode);
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
}

export interface TabsListState {
  orientation: Orientation;
  activationDirection: ActivationDirection;
}

export interface TabsListProps extends ViewProps, WebAccessibilityProps {
  /**
   * The content of the tabs list.
   */
  children?: React.ReactNode | ((state: TabsListState) => React.ReactNode);
  /**
   * Whether to automatically change the active tab on arrow key focus.
   * @default false
   */
  activateOnFocus?: boolean;
  /**
   * Whether to loop keyboard focus within the tabs list.
   * @default true
   */
  loopFocus?: boolean;
}

export interface TabState {
  active: boolean;
  disabled: boolean;
  orientation: Orientation;
  activationDirection: ActivationDirection;
  focused: boolean;
  focusVisible: boolean;
}

export interface TabProps
  extends Omit<PressableProps, 'children' | 'style'>,
    WebAccessibilityProps {
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
  /**
   * Callback fired when the tab receives focus.
   */
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * Callback fired when the tab loses focus.
   */
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
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

export interface TabsIndicatorState {
  orientation: Orientation;
  activationDirection: ActivationDirection;
  /**
   * The distance from the top of the parent container to the active tab.
   */
  '--active-tab-top'?: number;
  /**
   * The distance from the left of the parent container to the active tab.
   */
  '--active-tab-left'?: number;
  /**
   * The width of the active tab.
   */
  '--active-tab-width'?: number;
  /**
   * The height of the active tab.
   */
  '--active-tab-height'?: number;
}

export interface TabsIndicatorProps extends ViewProps, WebAccessibilityProps {
  /**
   * The content of the indicator.
   */
  children?: React.ReactNode | ((state: TabsIndicatorState) => React.ReactNode);
}

export interface TabPanelState {
  hidden: boolean;
  orientation: Orientation;
  activationDirection: ActivationDirection;
  index: number;
}

export interface TabPanelProps extends ViewProps, WebAccessibilityProps {
  /**
   * The content of the panel.
   */
  children?: React.ReactNode | ((state: TabPanelState) => React.ReactNode);
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

export type { KeyPressEventData, WebAccessibilityProps };
