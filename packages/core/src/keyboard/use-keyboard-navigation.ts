import * as React from 'react';
import { type NativeSyntheticEvent, Platform } from 'react-native';

import type {
  KeyboardDirection,
  KeyboardNavigationOptions,
  KeyDownEventData,
} from '../types';

const DEFAULT_KEY_MAP: Record<KeyboardDirection, string[]> = {
  first: ['Home'],
  last: ['End'],
  next: ['ArrowRight', 'ArrowDown', 'dpadRight', 'dpadDown'],
  prev: ['ArrowLeft', 'ArrowUp', 'dpadLeft', 'dpadUp'],
};

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
): {
  registerItem: (id: string, ref: React.RefObject<T>) => () => void;
  navigate: (currentId: string, direction: KeyboardDirection) => string | null;
  handleKeyDown: (
    currentId: string,
    event: NativeSyntheticEvent<KeyDownEventData> | KeyboardEvent,
  ) => string | null;
} {
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
      event: NativeSyntheticEvent<KeyDownEventData> | KeyboardEvent,
    ): string | null => {
      const { keyMap = {}, orientation = 'horizontal' } = optionsRef.current;

      const nativeEvent = (event as NativeSyntheticEvent<KeyDownEventData>)
        .nativeEvent;
      const key =
        nativeEvent?.key || (event as unknown as KeyDownEventData).key;

      if (!key) return null;

      const mergedKeyMap: Record<KeyboardDirection, string[]> = {
        first: [...DEFAULT_KEY_MAP.first, ...(keyMap.first ?? [])],
        last: [...DEFAULT_KEY_MAP.last, ...(keyMap.last ?? [])],
        next: [...(keyMap.next ?? [])],
        prev: [...(keyMap.prev ?? [])],
      };

      let direction: KeyboardDirection | null = null;

      if (mergedKeyMap.first.includes(key)) {
        direction = 'first';
      } else if (mergedKeyMap.last.includes(key)) {
        direction = 'last';
      } else {
        const isHorizontal =
          orientation === 'horizontal' || orientation === 'both';
        const isVertical = orientation === 'vertical' || orientation === 'both';

        if (isHorizontal && ['ArrowRight', 'dpadRight'].includes(key)) {
          direction = 'next';
        } else if (isHorizontal && ['ArrowLeft', 'dpadLeft'].includes(key)) {
          direction = 'prev';
        } else if (isVertical && ['ArrowDown', 'dpadDown'].includes(key)) {
          direction = 'next';
        } else if (isVertical && ['ArrowUp', 'dpadUp'].includes(key)) {
          direction = 'prev';
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
