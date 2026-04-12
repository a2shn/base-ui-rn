import { PressableWithKeyDown } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

export interface CollapsibleRootState {
  open: boolean;
  disabled: boolean;
}

export interface CollapsibleTriggerState extends FocusRingState {
  open: boolean;
  disabled: boolean;
}

export interface CollapsiblePanelState {
  open: boolean;
  disabled: boolean;
  panel: {
    height?: number;
    width?: number;
  }
}

export interface CollapsibleRootOpenChangeDetails {
  open: boolean;
}

export type CollapsibleRootProps = Omit<ViewProps, 'children' | 'style'> & {
  /**
   * The content of the collapsible.
   */
  children?: React.ReactNode | ((state: CollapsibleRootState) => React.ReactNode);
  /**
   * Style applied to the root view.
   */
  style?: StyleProp<ViewStyle> | ((state: CollapsibleRootState) => StyleProp<ViewStyle>);
  /**
   * Whether the collapsible is open by default.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * The controlled open state of the collapsible. Use with `onOpenChange`.
   */
  open?: boolean;
  /**
   * Fired when the open state changes.
   */
  onOpenChange?: (open: boolean, details: CollapsibleRootOpenChangeDetails) => void;
  /**
   * Whether the collapsible is disabled.
   * @default false
   */
  disabled?: boolean;
};

export type CollapsibleTriggerProps = Omit<React.ComponentProps<typeof PressableWithKeyDown>, 'children' | 'style'> & {
  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the trigger remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * The content of the trigger.
   */
  children?: React.ReactNode | ((state: CollapsibleTriggerState) => React.ReactNode);
  /**
   * Style applied to the trigger view.
   */
  style?: StyleProp<ViewStyle> | ((state: CollapsibleTriggerState) => StyleProp<ViewStyle>);
};

export type CollapsiblePanelProps = Omit<ViewProps, 'children' | 'style'> & {
  /**
   * The content of the panel.
   */
  children?: React.ReactNode | ((state: CollapsiblePanelState) => React.ReactNode);
  /**
   * Style applied to the panel view.
   */
  style?: StyleProp<ViewStyle> | ((state: CollapsiblePanelState) => StyleProp<ViewStyle>);
  /**
   * Whether the panel should be hidden until a native search (e.g., browser find) reveals it.
   * @default false
   */
  hiddenUntilFound?: boolean;
  /**
   * Whether to keep the panel mounted when closed.
   * @default false
   */
  keepMounted?: boolean;
};
