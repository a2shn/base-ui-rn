import {
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIALiveProps,
  type ARIATraitDisabled,
  type ARIATraitExpanded,
  type ARIATraitOrientation,
  type KeyPressEventData as CoreKeyPressEventData,
} from '@base-ui-rn/core';
import type {
  NativeSyntheticEvent,
  PressableProps,
  StyleProp,
  TargetedEvent,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * Web-specific accessibility props for Accordion Root.
 */
export type WebAccordionRootAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitOrientation & {
    /**
     * Indicates the orientation of the accordion.
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Present when the accordion is disabled.
     */
    'data-disabled'?: 'true';
  };

/**
 * Web-specific accessibility props for Accordion Item.
 */
export type WebAccordionItemAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled & {
    /**
     * Present when the accordion item is open.
     */
    'data-open'?: 'true';
    /**
     * Present when the accordion item is disabled.
     */
    'data-disabled'?: 'true';
    /**
     * The index of the accordion item.
     */
    'data-index'?: number;
  };

/**
 * Web-specific accessibility props for Accordion Trigger.
 */
export type WebAccordionTriggerAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitExpanded & {
    /**
     * Present when the accordion panel is open.
     */
    'data-panel-open'?: 'true';
    /**
     * Present when the trigger is disabled.
     */
    'data-disabled'?: 'true';
  };

/**
 * Web-specific accessibility props for Accordion Panel.
 */
export type WebAccordionPanelAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitOrientation & {
    /**
     * Present when the accordion panel is open.
     */
    'data-open'?: 'true';
    /**
     * Indicates the orientation of the accordion.
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Present when the accordion item is disabled.
     */
    'data-disabled'?: 'true';
    /**
     * The index of the accordion item.
     */
    'data-index'?: number;
    /**
     * Present when the panel is animating in.
     */
    'data-starting-style'?: '';
    /**
     * Present when the panel is animating out.
     */
    'data-ending-style'?: '';
  };

export type Orientation = 'vertical' | 'horizontal';

export type { CoreKeyPressEventData as KeyPressEventData };

export interface AccordionRootState {
  open: boolean;
  value: string | string[];
  orientation: Orientation;
  disabled: boolean;
  multiple: boolean;
  focusVisible: boolean;
}

export interface AccordionItemState {
  open: boolean;
  disabled: boolean;
  index: number;
  value: string;
  focusVisible: boolean;
}

export interface AccordionHeaderState {
  open: boolean;
  disabled: boolean;
  index: number;
  focusVisible: boolean;
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
  focusVisible: boolean;
  panel: {
    height?: number;
    width?: number;
  };
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
  /**
   * The content of the accordion.
   */
  children?: React.ReactNode | ((state: AccordionRootState) => React.ReactNode);
  /**
   * Style applied to the root view.
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
   * Whether to loop keyboard focus within the accordion.
   * @default true
   */
  loopFocus?: boolean;
  /**
   * Callback fired when keyboard focus changes.
   */
  onFocusChange?: (value: string) => void;
}

export interface AccordionItemProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebAccordionItemAccessibilityProps {
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

export interface AccordionHeaderProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebAccordionItemAccessibilityProps {
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

export interface AccordionTriggerProps
  extends
    Omit<PressableProps, 'children' | 'style'>,
    WebAccordionTriggerAccessibilityProps {
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
   * Callback fired when a key is pressed down.
   */
  onKeyDown?: (e: NativeSyntheticEvent<CoreKeyPressEventData>) => void;
  /**
   * Callback fired when a key is pressed.
   */
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * Callback fired when the trigger loses focus.
   */
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
}

export interface AccordionPanelProps
  extends
    Omit<ViewProps, 'children' | 'style'>,
    WebAccordionPanelAccessibilityProps {
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
   * Whether to keep the panel mounted when closed.
   * @default false
   */
  keepMounted?: boolean;
  /**
   * Whether the panel should be hidden until a specific search is performed.
   * @default false
   */
  hiddenUntilFound?: boolean;
}
