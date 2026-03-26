import {
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIALiveProps,
  type ARIATraitDisabled,
  type ARIATraitExpanded,
  type ARIATraitOrientation,
  type KeyPressEventData,
} from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type * as React from 'react';
import type {
  NativeSyntheticEvent,
  PressableProps,
  StyleProp,
  TargetedEvent,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * Web-specific accessibility props for Tabs Root.
 */
export type WebTabsRootAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitOrientation & {
    /**
     * Indicates the orientation of the tabs.
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Indicates the direction of the activation.
     */
    'data-activation-direction'?: 'left' | 'right' | 'up' | 'down' | 'none';
  };

/**
 * Web-specific accessibility props for Tabs List.
 */
export type WebTabsListAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitOrientation & {
    /**
     * Indicates the orientation of the tabs.
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Indicates the direction of the activation.
     */
    'data-activation-direction'?: 'left' | 'right' | 'up' | 'down' | 'none';
  };

/**
 * Web-specific accessibility props for Tabs Tab.
 */
export type WebTabsTabAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitExpanded &
  ARIATraitOrientation & {
    /**
     * Present when the tab is active.
     */
    'data-active'?: 'true';
    /**
     * Present when the tab is disabled.
     */
    'data-disabled'?: 'true';
    /**
     * Indicates the orientation of the tabs.
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Indicates the direction of the activation.
     */
    'data-activation-direction'?: 'left' | 'right' | 'up' | 'down' | 'none';
  };

/**
 * Web-specific accessibility props for Tabs Indicator.
 */
export type WebTabsIndicatorAccessibilityProps = ARIABaseProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitOrientation & {
    /**
     * Indicates the orientation of the tabs.
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Indicates the direction of the activation.
     */
    'data-activation-direction'?: 'left' | 'right' | 'up' | 'down' | 'none';
  };
// ...
export type WebTabsPanelAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitExpanded &
  ARIATraitOrientation & {
    /**
     * Present when the panel is hidden.
     */
    'data-hidden'?: 'true';
    /**
     * Indicates the orientation of the tabs.
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Indicates the direction of the activation.
     */
    'data-activation-direction'?: 'left' | 'right' | 'up' | 'down' | 'none';
    /**
     * The index of the tab panel.
     */
    'data-index'?: number;
  };

export type TabValue = string | number;
export type Orientation = 'horizontal' | 'vertical';
export type ActivationDirection = 'left' | 'right' | 'up' | 'down' | 'none';

export interface TabsRootState extends FocusRingState {
  value: TabValue | null;
  orientation: Orientation;
  activationDirection: ActivationDirection;
}

export interface TabsRootProps
  extends Omit<ViewProps, 'children' | 'style'>, WebTabsRootAccessibilityProps {
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

export interface TabsListState extends FocusRingState {
  orientation: Orientation;
  activationDirection: ActivationDirection;
}

export interface TabsListProps
  extends Omit<ViewProps, 'children' | 'style'>, WebTabsListAccessibilityProps {
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
  active: boolean;
  disabled: boolean;
  orientation: Orientation;
  activationDirection: ActivationDirection;
}

export interface TabProps
  extends
    Omit<PressableProps, 'children' | 'style'>,
    WebTabsTabAccessibilityProps {
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
  /**
   * Callback fired when the tab receives focus.
   */
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * Callback fired when the tab loses focus.
   */
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
}

export interface TabsIndicatorState extends FocusRingState {
  orientation: Orientation;
  activationDirection: ActivationDirection;
  tab: {
    height?: number;
    left?: number;
    top?: number;
    width?: number;
  };
}

export interface TabsIndicatorProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebTabsIndicatorAccessibilityProps {
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

export interface TabPanelState extends FocusRingState {
  hidden: boolean;
  orientation: Orientation;
  activationDirection: ActivationDirection;
  index: number;
}

export interface TabPanelProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebTabsPanelAccessibilityProps {
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

export type { KeyPressEventData };
