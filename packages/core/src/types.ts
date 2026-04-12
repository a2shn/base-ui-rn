import { ACTIVATION_ACTIONS } from './constants';

export type KeyDownEventData = { key: string };

export type KeyboardDirection = 'next' | 'prev' | 'first' | 'last';

export interface KeyboardNavigationOptions {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  keyMap?: Partial<Record<KeyboardDirection, string[]>>;
}

export interface KeyboardOptions {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  disabled?: boolean;
}

export interface UseControllableStateParams<T> {
  prop?: T;
  defaultProp?: T;
  onChange?: (state: T) => void;
}

export type ActivationAction = (typeof ACTIVATION_ACTIONS)[number];

export type AnyFn = (...args: any[]) => void;

export type HandlerMap = Record<string, AnyFn | null | undefined>;
