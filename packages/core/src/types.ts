/**
 * Data structure for keyboard events.
 */
export type KeyPressEventData = { key: string };

/**
 * Web-specific accessibility and interactivity props.
 * Used for keyboard focus and ARIA attributes on web platforms.
 */
export type WebAccessibilityProps = {
  tabIndex?: 0 | -1;
  'aria-disabled'?: boolean;
};

/**
 * Extended web props that include toggle-specific attributes.
 */
export type WebToggleAccessibilityProps = WebAccessibilityProps & {
  /**
   * Reflects pressed state for the ARIA button-toggle pattern on web.
   * Automatically set when using role="button".
   */
  'aria-pressed'?: boolean;
  /**
   * Custom data attribute applied on web for CSS selectors and testing.
   * Reflects the current pressed state as a boolean string.
   *
   * @example
   * [data-pressed="true"] { background: blue; }
   */
  'data-pressed'?: boolean;
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
