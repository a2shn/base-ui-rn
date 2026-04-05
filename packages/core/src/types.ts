import { ACTIVATION_ACTIONS } from './constants';

/**
 * Data payload for keyboard events.
 */
export type KeyDownEventData = { key: string };

/**
 * Direction of keyboard navigation.
 */
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

export interface UseControllableStateParams<T> {
  /**
   * The value to used in controlled mode.
   */
  prop?: T;
  /**
   * The initial value to be used in uncontrolled mode.
   */
  defaultProp?: T;
  /**
   * A callback fired when the state changes.
   */
  onChange?: (state: T) => void;
}

/**
 * The valid activation action types.
 */
export type ActivationAction = (typeof ACTIVATION_ACTIONS)[number];

/**
 * A function that can accept any arguments and return any value.
 */
export type AnyFn = (...args: any[]) => void;

/**
 * A map of event handler names to their handler functions.
 */
export type HandlerMap = Record<string, AnyFn | null | undefined>;
