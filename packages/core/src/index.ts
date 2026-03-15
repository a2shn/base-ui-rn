// Types
export type {
  KeyPressEventData,
  WebAccessibilityProps,
  WebRangeAccessibilityProps,
  WebToggleAccessibilityProps,
  WebToggleGroupAccessibilityProps,
  WebProgressAccessibilityProps,
  WebSeparatorAccessibilityProps,
  WebAccordionRootAccessibilityProps,
  WebAccordionItemAccessibilityProps,
  WebAccordionTriggerAccessibilityProps,
  WebAccordionPanelAccessibilityProps,
  WebMeterAccessibilityProps,
  WebSliderRootAccessibilityProps,
  WebSliderThumbAccessibilityProps,
  WebTabsRootAccessibilityProps,
  WebTabsListAccessibilityProps,
  WebTabsTabAccessibilityProps,
  WebTabsIndicatorAccessibilityProps,
  WebTabsPanelAccessibilityProps,
  WebSwitchAccessibilityProps,
  WebSwitchThumbAccessibilityProps,
  PressedChangeDetails,
} from './types';

// Constants
export {
  DEFAULT_HIT_SLOP,
  ACTIVATION_KEYS,
  isActivationKey,
  DEFAULT_FOCUS_RING_STYLE,
  type ActivationKey,
} from './constants';

// Accessibility utilities
export {
  mergeAccessibilityActions,
  isActivationAction,
  mergeAccessibilityState,
  resolveTabIndex,
  resolveAriaDisabled,
  resolveAriaPressed,
  resolveDataPressed,
} from './accessibility';

export {
  useKeyboardNavigation,
  useKeyboardActivation,
  useKeyboardRange,
} from './keyboard';
export type {
  KeyboardDirection,
  KeyboardNavigationOptions,
  KeyboardRangeOptions,
} from './keyboard';

// Utils
export { mergeRefs, clamp } from './utils';
