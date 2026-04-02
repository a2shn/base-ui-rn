import { GestureResponderEvent } from "react-native";
import { ACTIVATION_ACTIONS } from "./constants";

export type KeyDownEventData = { key: string };

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


export interface UseActivationDedupOptions<TPressed> {
  /**
   * The current pressed/active value. Kept in a ref internally so callbacks
   * always read the last committed value without stale closure issues.
   */
  pressed: TPressed;
  /** Whether the component is disabled. Prevents all activation paths. */
  disabled: boolean;
  /** Called with the next value whenever an activation is committed. */
  onCommit: (nextPressed: TPressed) => void;
  /** Derives the next value from the current one. Defaults to boolean NOT. */
  getNextPressed?: (current: TPressed) => TPressed;
}

export interface UseActivationDedupReturn {
  /**
   * Call this from your pointer/touch onPress handler.
   * Drops the press silently if the keyboard just fired an activation
   * (platform synthesized ghost press).
   */
  handlePress: (event: GestureResponderEvent) => void;
  /**
   * Call this from your keyboard activation handler (e.g. useKeyboardActivation
   * callback). Commits the toggle and arms the ghost-press guard so the
   * immediately following synthesized onPress is swallowed.
   */
  handleKeyboardActivation: () => void;
  /**
   * Call this from accessibility action handlers (screen reader activate).
   * Commits directly — no ghost press is synthesized by assistive technology.
   */
  handleAccessibilityActivation: () => void;
}

export type ActivationAction = (typeof ACTIVATION_ACTIONS)[number];

export type AnyFn = (...args: any[]) => void;
export type HandlerMap = Record<string, AnyFn | null | undefined>;

export type ProtectedKey =
  | 'disabled'
  | 'focusable'
  | 'ref'
  | 'style'
  | 'tabIndex'
  | 'children'
  | 'accessibilityState'
  | 'accessibilityActions'
  | 'importantForAccessibility';

