/**
 * Data structure for keyboard events.
 */
export type KeyPressEventData = { key: string };

/**
 * Web-specific accessibility and interactivity props.
 * Used for keyboard focus and ARIA attributes on web platforms.
 * @see https://www.w3.org/TR/wai-aria-1.2/
 */
export type WebAccessibilityProps = {
  tabIndex?: 0 | -1;
  'aria-disabled'?: boolean;
  /**
   * Defines a keyboard shortcut that activates or focuses the element.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-keyshortcuts
   */
  'aria-keyshortcuts'?: string;
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
   * Indicates whether an element, or another grouping element it controls, is currently expanded or collapsed.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-expanded
   */
  'aria-expanded'?: boolean;
  /**
   * Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-busy
   */
  'aria-busy'?: boolean;
  /**
   * Indicates whether the element is exposed to an accessibility API.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-hidden
   */
  'aria-hidden'?: boolean;
};

/**
 * Extended web props that include toggle-specific attributes.
 */
export type WebToggleAccessibilityProps = WebAccessibilityProps & {
  /**
   * Reflects pressed state for the ARIA button-toggle pattern on web.
   * Automatically set when using role="button".
   */
  'aria-pressed'?: boolean | 'mixed';
  /**
   * Custom data attribute applied on web for CSS selectors and testing.
   * Reflects the current pressed state.
   *
   * @example
   * [data-pressed="true"] { background: blue; }
   */
  'data-pressed'?: boolean;
};

/**
 * Web-specific accessibility props for ToggleGroup.
 */
export type WebToggleGroupAccessibilityProps = WebAccessibilityProps & {
  /**
   * Indicates the orientation of the toggle group.
   */
  'data-orientation'?: 'horizontal' | 'vertical';
  /**
   * Present when the toggle group is disabled.
   */
  'data-disabled'?: boolean;
  /**
   * Present when the toggle group allows multiple buttons to be in the pressed state at the same time.
   */
  'data-multiple'?: boolean;
  /**
   * Indicates the orientation of the toggle group for assistive technologies.
   */
  'aria-orientation'?: 'horizontal' | 'vertical';
};

/**
 * Web-specific accessibility props for Separator.
 */
export type WebSeparatorAccessibilityProps = WebAccessibilityProps & {
  /**
   * Indicates the orientation of the separator.
   */
  'data-orientation'?: 'horizontal' | 'vertical';
  /**
   * Indicates the orientation of the separator for assistive technologies.
   */
  'aria-orientation'?: 'horizontal' | 'vertical';
};

/**
 * Web-specific accessibility props for Progress.
 */
export type WebProgressAccessibilityProps = WebAccessibilityProps & {
  /**
   * Present when the progress has completed.
   */
  'data-complete'?: '';
  /**
   * Present when the progress is in indeterminate state.
   */
  'data-indeterminate'?: '';
  /**
   * Present while the progress is progressing.
   */
  'data-progressing'?: '';
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
};

/**
 * Web-specific accessibility props for Accordion Root.
 */
export type WebAccordionRootAccessibilityProps = WebAccessibilityProps & {
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
export type WebAccordionItemAccessibilityProps = WebAccessibilityProps & {
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
export type WebAccordionTriggerAccessibilityProps = WebAccessibilityProps & {
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
export type WebAccordionPanelAccessibilityProps = WebAccessibilityProps & {
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

/**
 * Web-specific accessibility props for Meter.
 */
export type WebMeterAccessibilityProps = WebAccessibilityProps & {
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
};

/**
 * Web-specific accessibility props for Tabs Root.
 */
export type WebTabsRootAccessibilityProps = WebAccessibilityProps & {
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
export type WebTabsListAccessibilityProps = WebAccessibilityProps & {
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
export type WebTabsTabAccessibilityProps = WebAccessibilityProps & {
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
export type WebTabsIndicatorAccessibilityProps = WebAccessibilityProps & {
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
 * Web-specific accessibility props for Tabs Panel.
 */
export type WebTabsPanelAccessibilityProps = WebAccessibilityProps & {
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

/**
 * Web-specific accessibility props for Switch Root.
 */
export type WebSwitchAccessibilityProps = WebAccessibilityProps & {
  /**
   * Reflects checked state for the ARIA switch pattern on web.
   */
  'aria-checked'?: boolean | 'mixed';
  /**
   * Reflects read-only state for the ARIA switch pattern on web.
   */
  'aria-readonly'?: boolean;
  /**
   * Custom data attribute applied on web for CSS selectors and testing.
   * Reflects the current checked state.
   */
  'data-checked'?: 'true';
  /**
   * Present when the switch is disabled.
   */
  'data-disabled'?: 'true';
};

/**
 * Web-specific accessibility props for Switch Thumb.
 */
export type WebSwitchThumbAccessibilityProps = WebAccessibilityProps & {
  /**
   * Custom data attribute applied on web for CSS selectors and testing.
   * Reflects the current checked state.
   */
  'data-checked'?: 'true';
  /**
   * Present when the switch is disabled.
   */
  'data-disabled'?: 'true';
};

/**
 * Base type for press/toggle activation details.
 * Describes how a component was activated.
 */
export interface PressedChangeDetails {
  /**
   * How the component was activated.
   *
   * - `'press'`               — touch or mouse press
   * - `'keyboard'`            — hardware keyboard key (Enter / Space / Select / OK …)
   * - `'accessibilityAction'` — screen reader action (activate / click / magicTap)
   */
  source: 'press' | 'keyboard' | 'accessibilityAction';
}
