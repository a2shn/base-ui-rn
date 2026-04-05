import { PressableWithKeyDown } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

/**
 * The layout orientation of the accordion.
 */
export type Orientation = 'vertical' | 'horizontal';

/**
 * Details passed to the `onValueChange` callback.
 */
export interface AccordionValueChangeDetails {
  /** The new active value or array of values. */
  value: string | string[];
}

/**
 * Details passed to the `onOpenChange` callback for an accordion item.
 */
export interface AccordionItemOpenChangeDetails {
  /** Whether the item is now open. */
  open: boolean;
  /** The value of the item that changed. */
  value: string;
}

export interface AccordionRootState {
  /** Whether any item in the accordion is currently open. */
  open: boolean;
  /** The value of the currently open item(s). */
  value: string | string[];
  /** The layout orientation of the accordion. */
  orientation: Orientation;
  /** Whether the entire accordion is disabled. */
  disabled: boolean;
  /** Whether multiple items can be open simultaneously. */
  multiple: boolean;
}

export interface AccordionItemState {
  /** Whether this specific item is open. */
  open: boolean;
  /** Whether this specific item (or the root) is disabled. */
  disabled: boolean;
  /** The zero-based index of this item among all registered items. */
  index: number;
  /** The unique value identifier for this item. */
  value: string;
}

export interface AccordionHeaderState {
  /** Whether the associated item is open. */
  open: boolean;
  /** Whether the associated item is disabled. */
  disabled: boolean;
  /** The zero-based index of the associated item. */
  index: number;
}

export interface AccordionTriggerState extends FocusRingState {
  /** Whether the associated item is open. */
  open: boolean;
  /** Whether the trigger is disabled. */
  disabled: boolean;
}

export interface AccordionPanelState {
  /** Whether the panel is currently open. */
  open: boolean;
  /** Whether the associated item is disabled. */
  disabled: boolean;
  /** The zero-based index of the associated item. */
  index: number;
  panel: {
    /** The measured height of the panel content, if available. */
    height?: number;
    /** The measured width of the panel content, if available. */
    width?: number;
  };
}

export interface AccordionRootProps extends Omit<
  ViewProps,
  'children' | 'style'
> {
  /**
   * The content of the accordion. Can be a React node or a render function.
   */
  children?: React.ReactNode | ((state: AccordionRootState) => React.ReactNode);
  /**
   * Style applied to the root view. Can be a static style or a function resolving based on state.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: AccordionRootState) => StyleProp<ViewStyle>);
  /**
   * The default value of the open item(s) when uncontrolled.
   */
  defaultValue?: string | string[];
  /**
   * The controlled value of the open item(s).
   */
  value?: string | string[];
  /**
   * Callback fired when the open item(s) change.
   */
  onValueChange?: (
    value: string | string[],
    details: AccordionValueChangeDetails,
  ) => void;
  /**
   * Whether multiple items can be open at the same time.
   * @default false
   */
  multiple?: boolean;
  /**
   * Whether the accordion is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The layout orientation of the accordion.
   * @default 'vertical'
   */
  orientation?: Orientation;
  /**
   * Whether to loop keyboard focus from the last item back to the first.
   * @default true
   */
  loopFocus?: boolean;
  /**
   * Callback fired when keyboard focus changes between items.
   */
  onFocusChange?: (value: string) => void;
}

export interface AccordionItemProps extends Omit<
  ViewProps,
  'children' | 'style'
> {
  /**
   * The content of the accordion item.
   */
  children?: React.ReactNode | ((state: AccordionItemState) => React.ReactNode);
  /**
   * Style applied to the item view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: AccordionItemState) => StyleProp<ViewStyle>);
  /**
   * A unique value for the accordion item.
   * If not provided, a random ID will be generated.
   */
  value?: string;
  /**
   * Whether the accordion item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Callback fired when the open state of the item changes.
   */
  onOpenChange?: (
    open: boolean,
    details: AccordionItemOpenChangeDetails,
  ) => void;
}

export interface AccordionHeaderProps extends Omit<
  ViewProps,
  'children' | 'style'
> {
  /**
   * The content of the accordion header.
   */
  children?:
    | React.ReactNode
    | ((state: AccordionHeaderState) => React.ReactNode);
  /**
   * Style applied to the header view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: AccordionHeaderState) => StyleProp<ViewStyle>);
}

export interface AccordionTriggerProps extends Omit<
  React.ComponentProps<typeof PressableWithKeyDown>,
  'children' | 'style'
> {
  /**
   * The content of the accordion trigger.
   */
  children?:
    | React.ReactNode
    | ((state: AccordionTriggerState) => React.ReactNode);
  /**
   * Style applied to the trigger view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: AccordionTriggerState) => StyleProp<ViewStyle>);
  /**
   * Disable the default focus ring styling.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the trigger remains focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
}

export interface AccordionPanelProps extends Omit<
  ViewProps,
  'children' | 'style'
> {
  /**
   * The content of the accordion panel.
   */
  children?:
    | React.ReactNode
    | ((state: AccordionPanelState) => React.ReactNode);
  /**
   * Style applied to the panel view.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: AccordionPanelState) => StyleProp<ViewStyle>);
  /**
   * Whether to keep the panel mounted in the tree when it is closed.
   * @default false
   */
  keepMounted?: boolean;
  /**
   * Whether the panel should be hidden until a specific native search is performed.
   * @default false
   */
  hiddenUntilFound?: boolean;
}
