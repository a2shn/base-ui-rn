import {
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIATraitDisabled,
  type ARIATraitExpanded,
  type FocusVisibleProps,
  type KeyPressEventData,
} from '@base-ui-rn/core';
import type {
  NativeSyntheticEvent,
  PressableProps,
  StyleProp,
  TargetedEvent,
  ViewProps,
  ViewStyle,
} from 'react-native';

export type { KeyPressEventData };

export interface CollapsibleRootState {
  open: boolean;
  disabled: boolean;
  focusVisible: boolean;
}

export interface CollapsibleTriggerState {
  open: boolean;
  disabled: boolean;
  focused: boolean;
  focusVisible: boolean;
}

export interface CollapsiblePanelState {
  open: boolean;
  disabled: boolean;
  focusVisible: boolean;
  '--collapsible-panel-height'?: number;
  '--collapsible-panel-width'?: number;
}

export interface CollapsibleRootOpenChangeDetails {
  open: boolean;
}

export type CollapsibleRootProps = Omit<ViewProps, 'children' | 'style'> &
  FocusVisibleProps & {
    children?:
      | React.ReactNode
      | ((state: CollapsibleRootState) => React.ReactNode);
    style?:
      | StyleProp<ViewStyle>
      | ((state: CollapsibleRootState) => StyleProp<ViewStyle>);
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (
      open: boolean,
      details: CollapsibleRootOpenChangeDetails,
    ) => void;
    disabled?: boolean;
  };

export type CollapsibleTriggerProps = Omit<
  PressableProps,
  'children' | 'style'
> &
  FocusVisibleProps & {
    children?:
      | React.ReactNode
      | ((state: CollapsibleTriggerState) => React.ReactNode);
    style?:
      | StyleProp<ViewStyle>
      | ((state: CollapsibleTriggerState) => StyleProp<ViewStyle>);
    onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
    onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  };

export type CollapsiblePanelProps = Omit<ViewProps, 'children' | 'style'> &
  FocusVisibleProps & {
    children?:
      | React.ReactNode
      | ((state: CollapsiblePanelState) => React.ReactNode);
    style?:
      | StyleProp<ViewStyle>
      | ((state: CollapsiblePanelState) => StyleProp<ViewStyle>);
    hiddenUntilFound?: boolean;
    keepMounted?: boolean;
  };
