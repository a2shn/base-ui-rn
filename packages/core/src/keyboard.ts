import * as React from 'react';
import { Platform, type NativeSyntheticEvent } from 'react-native';

import { isActivationKey } from './constants';
import type { KeyPressEventData } from './types';

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

const DEFAULT_KEY_MAP: Record<KeyboardDirection, string[]> = {
  next: ['ArrowRight', 'ArrowDown', 'dpadRight', 'dpadDown'],
  prev: ['ArrowLeft', 'ArrowUp', 'dpadLeft', 'dpadUp'],
  first: ['Home'],
  last: ['End'],
};

/**
 * A hook that handles keyboard activation (Space, Enter, Gamepad A/Select, etc.).
 * Calls the provided `onActivate` callback when an activation key is pressed.
 *
 * @param onActivate Callback fired on an activation key press.
 * @param isDisabled Whether the component is disabled, which blocks activation.
 * @returns A generic onKeyPress handler to spread onto a component.
 */
export function useKeyboardActivation(
  onActivate: () => void,
  isDisabled = false,
) {
  return React.useCallback(
    (e: NativeSyntheticEvent<KeyPressEventData> | KeyboardEvent) => {
      const nativeEvent = (e as NativeSyntheticEvent<KeyPressEventData>)
        .nativeEvent;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const key = nativeEvent?.key || (e as any).key;
      if (!key) return;

      if (isActivationKey(key) && !isDisabled) {
        if (e.preventDefault) e.preventDefault();
        onActivate();
      }
    },
    [onActivate, isDisabled],
  );
}

export interface KeyboardRangeOptions {
  /**
   * Callback fired for incrementing the value by a small step.
   */
  onIncrement?: () => void;
  /**
   * Callback fired for decrementing the value by a small step.
   */
  onDecrement?: () => void;
  /**
   * Callback fired for incrementing the value by a large step.
   */
  onPageUp?: () => void;
  /**
   * Callback fired for decrementing the value by a large step.
   */
  onPageDown?: () => void;
  /**
   * Callback fired for setting the value to its minimum.
   */
  onHome?: () => void;
  /**
   * Callback fired for setting the value to its maximum.
   */
  onEnd?: () => void;
  /**
   * Whether the component is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The orientation of the range widget.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * A hook that handles keyboard interactions for range-like components (Slider, Meter, Progress).
 * Follows WAI-ARIA slider design pattern.
 *
 * @param options Keyboard range options.
 * @returns A generic onKeyPress handler.
 */
export function useKeyboardRange(options: KeyboardRangeOptions) {
  const {
    onIncrement,
    onDecrement,
    onPageUp,
    onPageDown,
    onHome,
    onEnd,
    disabled = false,
    orientation = 'horizontal',
  } = options;

  return React.useCallback(
    (e: NativeSyntheticEvent<KeyPressEventData> | KeyboardEvent) => {
      if (disabled) return;

      const nativeEvent = (e as NativeSyntheticEvent<KeyPressEventData>)
        .nativeEvent;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const key = nativeEvent?.key || (e as any).key;
      if (!key) return;

      let handled = false;

      // ARIA: ArrowRight/Up increment, ArrowLeft/Down decrement regardless of orientation.
      if (key === 'ArrowRight' || key === 'ArrowUp') {
        onIncrement?.();
        handled = true;
      } else if (key === 'ArrowLeft' || key === 'ArrowDown') {
        onDecrement?.();
        handled = true;
      } else if (key === 'PageUp') {
        onPageUp?.();
        handled = true;
      } else if (key === 'PageDown') {
        onPageDown?.();
        handled = true;
      } else if (key === 'Home') {
        onHome?.();
        handled = true;
      } else if (key === 'End') {
        onEnd?.();
        handled = true;
      }

      if (handled && e.preventDefault) {
        e.preventDefault();
      }
    },
    [
      onIncrement,
      onDecrement,
      onPageUp,
      onPageDown,
      onHome,
      onEnd,
      disabled,
      orientation,
    ],
  );
}

/**
 * A modular hook for managing keyboard navigation within a group of elements.
 *
 * It provides a centralized way to handle arrow key navigation, Home/End keys,
 * and focus management.
 */
export function useKeyboardNavigation<T = unknown>(
  options: KeyboardNavigationOptions = {},
) {
  const { orientation = 'horizontal', loop = true, keyMap = {} } = options;

  const items = React.useRef<Map<string, React.RefObject<T>>>(new Map());
  const itemOrder = React.useRef<string[]>([]);

  const registerItem = React.useCallback(
    (id: string, ref: React.RefObject<T>) => {
      items.current.set(id, ref);
      if (!itemOrder.current.includes(id)) {
        itemOrder.current.push(id);
      }
      return () => {
        items.current.delete(id);
        itemOrder.current = itemOrder.current.filter((itemId) => itemId !== id);
      };
    },
    [],
  );

  const navigate = React.useCallback(
    (currentId: string, direction: KeyboardDirection): string | null => {
      const order = itemOrder.current;
      const index = order.indexOf(currentId);
      if (index === -1) return null;

      let nextIndex = index;
      switch (direction) {
        case 'next':
          nextIndex = index + 1;
          if (nextIndex >= order.length) {
            nextIndex = loop ? 0 : index;
          }
          break;
        case 'prev':
          nextIndex = index - 1;
          if (nextIndex < 0) {
            nextIndex = loop ? order.length - 1 : index;
          }
          break;
        case 'first':
          nextIndex = 0;
          break;
        case 'last':
          nextIndex = order.length - 1;
          break;
      }

      return order[nextIndex] ?? null;
    },
    [loop],
  );

  const handleKeyDown = React.useCallback(
    (
      currentId: string,
      event: NativeSyntheticEvent<KeyPressEventData> | KeyboardEvent,
    ) => {
      const nativeEvent = (event as NativeSyntheticEvent<KeyPressEventData>)
        .nativeEvent;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const key = nativeEvent?.key || (event as any).key;
      if (!key) return null;

      const mergedKeyMap = { ...DEFAULT_KEY_MAP, ...keyMap };
      let direction: KeyboardDirection | null = null;

      // Prioritize first/last keys (orientation-agnostic)
      if (mergedKeyMap.first.includes(key)) {
        direction = 'first';
      } else if (mergedKeyMap.last.includes(key)) {
        direction = 'last';
      } else {
        // Handle next/prev keys based on orientation
        if (
          (orientation === 'horizontal' || orientation === 'both') &&
          mergedKeyMap.next.includes(key)
        ) {
          direction = 'next';
        } else if (
          (orientation === 'horizontal' || orientation === 'both') &&
          mergedKeyMap.prev.includes(key)
        ) {
          direction = 'prev';
        } else if (
          (orientation === 'vertical' || orientation === 'both') &&
          mergedKeyMap.next.includes(key)
        ) {
          direction = 'next';
        } else if (
          (orientation === 'vertical' || orientation === 'both') &&
          mergedKeyMap.prev.includes(key)
        ) {
          direction = 'prev';
        }
      }

      if (direction) {
        const nextId = navigate(currentId, direction);
        if (nextId && nextId !== currentId) {
          const nextRef = items.current.get(nextId);
          if (nextRef?.current) {
            const element = nextRef.current as { focus?: () => void };
            if (typeof element.focus === 'function') {
              // Prevent default scroll behavior on web
              if (event.preventDefault) event.preventDefault();

              const isWeb = Platform.OS === 'web';
              if (isWeb) {
                element.focus();
              } else {
                // On native, sometimes a small delay helps
                setTimeout(() => element.focus?.(), 0);
              }
              return nextId;
            }
          }
        }
      }

      return null;
    },
    [orientation, navigate, keyMap],
  );

  return React.useMemo(
    () => ({
      registerItem,
      handleKeyDown,
      navigate,
    }),
    [registerItem, handleKeyDown, navigate],
  );
}
