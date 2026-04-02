import React from 'react';
import { NativeSyntheticEvent } from 'react-native';

import { KeyboardOptions, KeyDownEventData } from '../types';

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
export function useKeyboard(
  options: KeyboardOptions,
): (e: NativeSyntheticEvent<KeyDownEventData> | KeyboardEvent) => void {
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  return React.useCallback(
    (e: NativeSyntheticEvent<KeyDownEventData> | KeyboardEvent) => {
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

      const nativeEvent = (e as NativeSyntheticEvent<KeyDownEventData>)
        .nativeEvent;
      const key = nativeEvent?.key || (e as unknown as KeyDownEventData).key;

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
