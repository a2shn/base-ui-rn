import type {
  ViewProps,
  PressableProps,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';
import {
  type KeyPressEventData as CoreKeyPressEventData,
  type WebAccordionRootAccessibilityProps,
  type WebAccordionItemAccessibilityProps,
  type WebAccordionTriggerAccessibilityProps,
  type WebAccordionPanelAccessibilityProps,
} from '@base-ui-rn/core';

export type Orientation = 'vertical' | 'horizontal';

export type { CoreKeyPressEventData as KeyPressEventData };

export interface AccordionRootState {
  open: boolean;
  value: string | string[];
  orientation: Orientation;
  disabled: boolean;
  multiple: boolean;
}

export interface AccordionItemState {
  open: boolean;
  disabled: boolean;
  index: number;
  value: string;
}

export interface AccordionHeaderState {
  open: boolean;
  disabled: boolean;
  index: number;
}

export interface AccordionTriggerState {
  open: boolean;
  disabled: boolean;
  focused: boolean;
  focusVisible: boolean;
}

export interface AccordionPanelState {
  open: boolean;
  disabled: boolean;
  index: number;
  /**
   * The accordion panel's height.
   */
  '--accordion-panel-height'?: number;
  /**
   * The accordion panel's width.
   */
  '--accordion-panel-width'?: number;
}

export interface AccordionValueChangeDetails {
  value: string | string[];
  reason: 'toggle' | 'focus';
}

export interface AccordionItemOpenChangeDetails {
  open: boolean;
  value: string;
  reason: 'toggle' | 'focus';
}

export interface AccordionRootProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebAccordionRootAccessibilityProps {
  children?: React.ReactNode | ((state: AccordionRootState) => React.ReactNode);
  style?:
    | StyleProp<ViewStyle>
    | ((state: AccordionRootState) => StyleProp<ViewStyle>);
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (
    value: string | string[],
    details: AccordionValueChangeDetails,
  ) => void;
  multiple?: boolean;
  disabled?: boolean;
  orientation?: Orientation;
  loopFocus?: boolean;
}

export interface AccordionItemProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebAccordionItemAccessibilityProps {
  children?: React.ReactNode | ((state: AccordionItemState) => React.ReactNode);
  style?:
    | StyleProp<ViewStyle>
    | ((state: AccordionItemState) => StyleProp<ViewStyle>);
  value?: string;
  disabled?: boolean;
  onOpenChange?: (
    open: boolean,
    details: AccordionItemOpenChangeDetails,
  ) => void;
}

export interface AccordionHeaderProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebAccordionItemAccessibilityProps {
  children?:
    | React.ReactNode
    | ((state: AccordionHeaderState) => React.ReactNode);
  style?:
    | StyleProp<ViewStyle>
    | ((state: AccordionHeaderState) => StyleProp<ViewStyle>);
}

export interface AccordionTriggerProps
  extends
    Omit<PressableProps, 'children' | 'style'>,
    WebAccordionTriggerAccessibilityProps {
  children?:
    | React.ReactNode
    | ((state: AccordionTriggerState) => React.ReactNode);
  style?:
    | StyleProp<ViewStyle>
    | ((state: AccordionTriggerState) => StyleProp<ViewStyle>);
  onKeyDown?: (e: NativeSyntheticEvent<CoreKeyPressEventData>) => void;
  onKeyPress?: (e: NativeSyntheticEvent<CoreKeyPressEventData>) => void;
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * Whether the trigger should be in a focus-visible state.
   * Useful for manual control of focus ring.
   * @default false
   */
  focusVisible?: boolean;
  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
}

export interface AccordionPanelProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebAccordionPanelAccessibilityProps {
  children?:
    | React.ReactNode
    | ((state: AccordionPanelState) => React.ReactNode);
  style?:
    | StyleProp<ViewStyle>
    | ((state: AccordionPanelState) => StyleProp<ViewStyle>);
  keepMounted?: boolean;
  hiddenUntilFound?: boolean;
}
