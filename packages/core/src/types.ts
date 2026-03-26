/**
 * Data structure for keyboard events.
 */
export type KeyPressEventData = { key: string };

/**
 * Common labeling and description attributes.
 */
export interface ARIABaseProps {
  /**
   * Defines a string value that labels the current element.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-label
   */
  'aria-label'?: string;
  /**
   * Identifies the element (or elements) that labels the current element.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby
   */
  'aria-labelledby'?: string;
  /**
   * Identifies the element (or elements) that describes the object.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-describedby
   */
  'aria-describedby'?: string;
  /**
   * Identifies the element (or elements) that provide a detailed, extended description for the object.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-details
   */
  'aria-details'?: string;
  /**
   * Indicates whether the element is exposed to an accessibility API.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-hidden
   */
  'aria-hidden'?: boolean;
}

/**
 * Attributes for components that can be focused.
 */
export interface ARIAFocusProps {
  /**
   * Indicates if the element can take input focus.
   * @default 0 (on focusable roles)
   */
  tabIndex?: 0 | -1;
  /**
   * Defines a keyboard shortcut that activates or focuses the element.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-keyshortcuts
   */
  'aria-keyshortcuts'?: string;
}

/**
 * Attributes for components that indicate a busy or live state.
 */
export interface ARIALiveProps {
  /**
   * Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-busy
   */
  'aria-busy'?: boolean;
}

/**
 * Attributes for components that can be disabled.
 */
export interface ARIATraitDisabled {
  /**
   * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-disabled
   */
  'aria-disabled'?: boolean;
}

/**
 * Attributes for components that can be expanded or collapsed.
 */
export interface ARIATraitExpanded {
  /**
   * Indicates whether an element, or another grouping element it controls, is currently expanded or collapsed.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-expanded
   */
  'aria-expanded'?: boolean;
}

/**
 * Attributes for components that have a specific orientation.
 */
export interface ARIATraitOrientation {
  /**
   * Indicates the orientation of the component for assistive technologies.
   */
  'aria-orientation'?: 'horizontal' | 'vertical';
}

/**
 * Attributes for components that represent a value within a range.
 */
export interface ARIATraitRange {
  /**
   * Defines the maximum allowed value for a range widget.
   */
  'aria-valuemax'?: number;
  /**
   * Defines the minimum allowed value for a range widget.
   */
  'aria-valuemin'?: number;
  /**
   * Defines the current value for a range widget.
   */
  'aria-valuenow'?: number;
  /**
   * Defines the human readable text alternative of aria-valuenow for a range widget.
   */
  'aria-valuetext'?: string;
}

/**
 * Base type for press/toggle activation details.
 * Describes how a component was activated.
 */
export interface PressedChangeDetails {
  /**
   * How the component was activated.
   /**
    * - `'press'`               — touch or mouse press
    * - `'keyboard'`            — hardware keyboard key (Enter / Space / Select / OK …)
    * - `'accessibilityAction'` — screen reader action (activate / click / magicTap)
    */
  source: 'press' | 'keyboard' | 'accessibilityAction';
}

export type KeyboardDirection = 'next' | 'prev' | 'first' | 'last';

export interface KeyboardNavigationOptions {
  /**
   * The orientation of the navigation.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /**
   * Whether navigation should loop around when reaching the start or end.
   * @default true
   */
  loop?: boolean;
  /**
   * Custom key mappings for navigation.
   */
  keyMap?: Partial<Record<KeyboardDirection, string[]>>;
}

export interface KeyboardOptions {
  /**
   * Callback fired for ArrowUp key press.
   */
  onArrowUp?: () => void;
  /**
   * Callback fired for ArrowDown key press.
   */
  onArrowDown?: () => void;
  /**
   * Callback fired for ArrowLeft key press.
   */
  onArrowLeft?: () => void;
  /**
   * Callback fired for ArrowRight key press.
   */
  onArrowRight?: () => void;
  /**
   * Callback fired for PageUp key press.
   */
  onPageUp?: () => void;
  /**
   * Callback fired for PageDown key press.
   */
  onPageDown?: () => void;
  /**
   * Callback fired for Home key press.
   */
  onHome?: () => void;
  /**
   * Callback fired for End key press.
   */
  onEnd?: () => void;
  /**
   * Whether the component is disabled.
   * @default false
   */
  disabled?: boolean;
}
