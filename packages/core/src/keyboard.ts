import * as React from 'react';
import { type NativeSyntheticEvent, Platform } from 'react-native';

import { isActivationKey } from './constants';
import type {
  KeyboardDirection,
  KeyboardNavigationOptions,
  KeyboardOptions,
  KeyPressEventData,
} from './types';

const DEFAULT_KEY_MAP: Record<KeyboardDirection, string[]> = {
  first: ['Home'],
  last: ['End'],
  next: ['ArrowRight', 'ArrowDown', 'dpadRight', 'dpadDown'],
  prev: ['ArrowLeft', 'ArrowUp', 'dpadLeft', 'dpadUp'],
};

/**
 * A hook that handles keyboard activation (Space, Enter, Gamepad A/Select, etc.).
 *
 * Use this hook for components that act like buttons or links, where pressing
 * Space or Enter should trigger an action. It automatically handles
 * preventDefault() on web to avoid double-activation and scrolling.
 *
 * @param onActivate Callback fired on an activation key press.
 * @param isDisabled Whether the component is disabled, which blocks activation.
 * @returns A generic onKeyDown handler to spread onto a component.
 *
 * @example
 * ```tsx
 * function MyButton({ onPress }) {
 *   const onKeyDown = useKeyboardActivation(onPress);
 *   return <View onKeyDown={onKeyDown} accessible role="button" />;
 * }
 * ```
 */
export function useKeyboardActivation(
  onActivate: () => void,
  isDisabled = false,
) {
  const onActivateRef = React.useRef(onActivate);
  onActivateRef.current = onActivate;

  const isDisabledRef = React.useRef(isDisabled);
  isDisabledRef.current = isDisabled;

  return React.useCallback(
    (e: NativeSyntheticEvent<KeyPressEventData> | KeyboardEvent) => {
      const nativeEvent = (e as NativeSyntheticEvent<KeyPressEventData>)
        .nativeEvent;
      const key = nativeEvent?.key || (e as unknown as KeyPressEventData).key;
      if (!key) return;

      if (isActivationKey(key) && !isDisabledRef.current) {
        if (e.preventDefault) e.preventDefault();
        onActivateRef.current();
      }
    },
    [],
  );
}

/**
 * A hook that handles physical key presses (Arrows, PageUp/Down, Home/End).
 *
 * Use this hook for components that need to respond to specific physical keys
 * regardless of logical orientation or focus navigation. It is ideal for
 * primitives like Sliders, ScrollAreas, or custom pickers.
 *
 * Unlike `useKeyboardNavigation`, this hook does not manage focus between
 * siblings; it only maps key presses to provided callbacks.
 *
 * @param options Keyboard options mapped to specific keys.
 * @returns A generic onKeyDown handler.
 *
 * @example
 * ```tsx
 * const onKeyDown = useKeyboard({
 *   onArrowUp: () => setVolume(v => v + 1),
 *   onArrowDown: () => setVolume(v => v - 1),
 * });
 * return <View onKeyDown={onKeyDown} />;
 * ```
 */
export function useKeyboard(options: KeyboardOptions) {
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  return React.useCallback(
    (e: NativeSyntheticEvent<KeyPressEventData> | KeyboardEvent) => {
      const {
        disabled = false,
        onArrowDown,
        onArrowLeft,
        onArrowRight,
        onArrowUp,
        onEnd,
        onHome,
        onPageDown,
        onPageUp,
      } = optionsRef.current;

      if (disabled) return;

      const nativeEvent = (e as NativeSyntheticEvent<KeyPressEventData>)
        .nativeEvent;
      const key = nativeEvent?.key || (e as unknown as KeyPressEventData).key;
      if (!key) return;

      const handlers: Record<string, (() => void) | undefined> = {
        ArrowDown: onArrowDown,
        ArrowLeft: onArrowLeft,
        ArrowRight: onArrowRight,
        ArrowUp: onArrowUp,
        End: onEnd,
        Home: onHome,
        PageDown: onPageDown,
        PageUp: onPageUp,
      };

      const handler = handlers[key];
      if (handler) {
        handler();
        if (e.preventDefault) e.preventDefault();
      }
    },
    [],
  );
}

/**
 * A modular hook for managing keyboard navigation within a group of elements.
 *
 * Use this hook for composite widgets where the user navigates between sibling
 * items using arrow keys (roving tabindex pattern). It automatically manages
 * registration of items, calculating the next item in the order, and
 * moving focus to the correct element.
 *
 * Ideal for primitives like Tabs, Accordion, or ToggleGroup.
 *
 * @param options Navigation configuration (orientation, looping, etc.).
 * @returns Registration and key handling functions.
 *
 * @example
 * ```tsx
 * const { registerItem, handleKeyDown } = useKeyboardNavigation();
 *
 * // In the parent:
 * <View onKeyDown={(e) => handleKeyDown(currentId, e)}>
 *   {items.map(item => (
 *     <Item
 *       key={item.id}
 *       ref={registerItem(item.id, React.createRef())}
 *     />
 *   ))}
 * </View>
 * ```
 */
export function useKeyboardNavigation<T = unknown>(
  options: KeyboardNavigationOptions = {},
) {
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

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
      const { loop = true } = optionsRef.current;
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
    [],
  );

  const handleKeyDown = React.useCallback(
    (
      currentId: string,
      event: NativeSyntheticEvent<KeyPressEventData> | KeyboardEvent,
    ) => {
      const { keyMap = {}, orientation = 'horizontal' } = optionsRef.current;
      const nativeEvent = (event as NativeSyntheticEvent<KeyPressEventData>)
        .nativeEvent;
      const key =
        nativeEvent?.key || (event as unknown as KeyPressEventData).key;
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
        const isHorizontal =
          orientation === 'horizontal' || orientation === 'both';
        const isVertical = orientation === 'vertical' || orientation === 'both';

        if (isHorizontal && (key === 'ArrowRight' || key === 'ArrowLeft')) {
          direction = key === 'ArrowRight' ? 'next' : 'prev';
        } else if (isVertical && (key === 'ArrowDown' || key === 'ArrowUp')) {
          direction = key === 'ArrowDown' ? 'next' : 'prev';
        } else if (mergedKeyMap.next.includes(key)) {
          direction = 'next';
        } else if (mergedKeyMap.prev.includes(key)) {
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
              if (event.preventDefault) event.preventDefault();

              const isWeb = Platform.OS === 'web';
              if (isWeb) {
                element.focus();
              } else {
                setTimeout(() => element.focus?.(), 0);
              }
              return nextId;
            }
          }
        }
      }

      return null;
    },
    [navigate],
  );

  return React.useMemo(
    () => ({
      handleKeyDown,
      navigate,
      registerItem,
    }),
    [registerItem, handleKeyDown, navigate],
  );
}
