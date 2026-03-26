import { type KeyPressEventData } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type {
  NativeSyntheticEvent,
  PressableProps,
  StyleProp,
  TargetedEvent,
  ViewProps,
  ViewStyle,
} from 'react-native';

export type { KeyPressEventData };

/**
 * The state of the Collapsible root.
 */
export interface CollapsibleRootState extends FocusRingState {
  /**
   * Whether the collapsible is open.
   */
  open: boolean;
  /**
   * Whether the collapsible is disabled.
   */
  disabled: boolean;
}

/**
 * The state of the Collapsible trigger.
 */
export interface CollapsibleTriggerState extends FocusRingState {
  /**
   * Whether the collapsible is open.
   */
  open: boolean;
  /**
   * Whether the collapsible is disabled.
   */
  disabled: boolean;
}

/**
 * The state of the Collapsible panel.
 */
export interface CollapsiblePanelState extends FocusRingState {
  /**
   * Whether the collapsible is open.
   */
  open: boolean;
  /**
   * Whether the collapsible is disabled.
   */
  disabled: boolean;
  /**
   * The measured dimensions of the panel content.
   */
  panel: {
    /**
     * The height of the panel content.
     */
    height?: number;
    /**
     * The width of the panel content.
     */
    width?: number;
  };
}

/**
 * Details passed to the `onOpenChange` callback.
 */
export interface CollapsibleRootOpenChangeDetails {
  /**
   * Whether the collapsible is open.
   */
  open: boolean;
}

/**
 * Props for the Collapsible root component.
 */
export type CollapsibleRootProps = Omit<ViewProps, 'children' | 'style'> & {
  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * The content of the collapsible.
   */
  children?:
    | React.ReactNode
    | ((state: CollapsibleRootState) => React.ReactNode);
  /**
   * Style applied to the root view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: CollapsibleRootState) => StyleProp<ViewStyle>);
  /**
   * Whether the collapsible is open by default.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * The controlled open state of the collapsible.
   */
  open?: boolean;
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (
    open: boolean,
    details: CollapsibleRootOpenChangeDetails,
  ) => void;
  /**
   * Whether the collapsible is disabled.
   * @default false
   */
  disabled?: boolean;
};

/**
 * Props for the Collapsible trigger component.
 */
export type CollapsibleTriggerProps = Omit<
  PressableProps,
  'children' | 'style'
> & {
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
  children?:
    | React.ReactNode
    | ((state: CollapsibleTriggerState) => React.ReactNode);
  /**
   * Style applied to the trigger view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: CollapsibleTriggerState) => StyleProp<ViewStyle>);
  /**
   * Callback fired when the trigger gains focus.
   */
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * Callback fired when the trigger loses focus.
   */
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
};

/**
 * Props for the Collapsible panel component.
 */
export type CollapsiblePanelProps = Omit<ViewProps, 'children' | 'style'> & {
  /**
   * Whether to disable the default focus ring style.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * The content of the panel.
   */
  children?:
    | React.ReactNode
    | ((state: CollapsiblePanelState) => React.ReactNode);
  /**
   * Style applied to the panel view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: CollapsiblePanelState) => StyleProp<ViewStyle>);
  /**
   * Whether to hide the panel until a search is performed.
   * @default false
   */
  hiddenUntilFound?: boolean;
  /**
   * Whether to keep the panel mounted when closed.
   * @default false
   */
  keepMounted?: boolean;
};
