import * as React from 'react';
import { Platform } from 'react-native';

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
  next: ['ArrowRight', 'ArrowDown'],
  prev: ['ArrowLeft', 'ArrowUp'],
  first: ['Home'],
  last: ['End'],
};

/**
 * A modular hook for managing keyboard navigation within a group of elements.
 *
 * It provides a centralized way to handle arrow key navigation, Home/End keys,
 * and focus management.
 */
export function useKeyboardNavigation<T = any>(
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
    (currentId: string, event: any) => {
      const key = event.nativeEvent?.key || event.key;
      if (!key) return null;

      const mergedKeyMap = { ...DEFAULT_KEY_MAP, ...keyMap };
      let direction: KeyboardDirection | null = null;

      if (orientation === 'horizontal' || orientation === 'both') {
        if (
          mergedKeyMap.next.includes('ArrowRight') &&
          key === 'ArrowRight'
        )
          direction = 'next';
        if (
          mergedKeyMap.prev.includes('ArrowLeft') &&
          key === 'ArrowLeft'
        )
          direction = 'prev';
      }

      if (orientation === 'vertical' || orientation === 'both') {
        if (mergedKeyMap.next.includes('ArrowDown') && key === 'ArrowDown')
          direction = 'next';
        if (mergedKeyMap.prev.includes('ArrowUp') && key === 'ArrowUp')
          direction = 'prev';
      }

      if (mergedKeyMap.first.includes(key)) direction = 'first';
      if (mergedKeyMap.last.includes(key)) direction = 'last';

      if (direction) {
        const nextId = navigate(currentId, direction);
        if (nextId && nextId !== currentId) {
          const nextRef = items.current.get(nextId);
          if (nextRef?.current) {
            const element = nextRef.current as any;
            if (typeof element.focus === 'function') {
              // Prevent default scroll behavior on web
              if (event.preventDefault) event.preventDefault();

              const isWeb = Platform.OS === 'web';
              if (isWeb) {
                element.focus();
              } else {
                // On native, sometimes a small delay helps
                setTimeout(() => element.focus(), 0);
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

// Global Keyboard Coordination System

export interface KeyboardHandler {
  id: string;
  onKeyDown: (event: any) => boolean | void;
  priority?: number;
}

interface KeyboardContextValue {
  registerHandler: (handler: KeyboardHandler) => () => void;
}

const KeyboardContext = React.createContext<KeyboardContextValue | null>(null);

/**
 * Coordinator for global keyboard events to prevent conflicts between different UI layers.
 */
export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const handlers = React.useRef<KeyboardHandler[]>([]);

  const registerHandler = React.useCallback((handler: KeyboardHandler) => {
    handlers.current.push(handler);
    // Sort by priority (higher first) then by registration order (LIFO)
    handlers.current.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return () => {
      handlers.current = handlers.current.filter((h) => h.id !== handler.id);
    };
  }, []);

  // In a real application, you might attach a global listener to the window on web
  // or a top-level View on Native.

  const contextValue = React.useMemo(() => ({ registerHandler }), [registerHandler]);

  return (
    <KeyboardContext.Provider value={contextValue}>
      {children}
    </KeyboardContext.Provider>
  );
};

/**
 * Hook to register a keyboard handler with the global coordinator.
 */
export function useKeyboardManager(handler: KeyboardHandler) {
  const context = React.useContext(KeyboardContext);

  React.useEffect(() => {
    if (context) {
      return context.registerHandler(handler);
    }
    return undefined;
  }, [context, handler]);
}
