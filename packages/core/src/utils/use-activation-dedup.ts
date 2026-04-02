import { UseActivationDedupOptions, UseActivationDedupReturn } from '@/types';
import * as React from 'react';
import { type GestureResponderEvent } from 'react-native';
import { isDefaultPrevented } from './compose-event-handlers';


/**
 * Centralises all three activation-deduplication problems found: 
 *
 * 1. Stale closure on `pressed` — reads from a ref updated in useLayoutEffect
 *    so rapid interactions always invert the last *committed* value.
 *
 * 2. Keyboard + synthesized ghost press — platforms (web/RN) synthesize an
 *    onPress after Enter/Space. The keyboard path arms `lastActivationWasKeyboardRef`;
 *    handlePress consumes and drops itself when the flag is set. No timers.
 *
 * 3. Source isolation — each activation path (pointer, keyboard, a11y) has its
 *    own handler so they can never accidentally stack inside the same tick.
 */
export function useActivationDedup<TPressed = boolean>({
  pressed,
  disabled,
  onCommit,
  getNextPressed,
}: UseActivationDedupOptions<TPressed>): UseActivationDedupReturn {
  const pressedRef = React.useRef<TPressed>(pressed);
  const onCommitRef = React.useRef(onCommit);
  const getNextPressedRef = React.useRef(getNextPressed);

  // Flag set by keyboard path, consumed by pointer path.
  // Lifetime: from handleKeyboardActivation → next handlePress call.
  const lastActivationWasKeyboardRef = React.useRef(false);

  React.useLayoutEffect(() => {
    pressedRef.current = pressed;
    onCommitRef.current = onCommit;
    getNextPressedRef.current = getNextPressed;
  }, [pressed, onCommit, getNextPressed]);

  const commit = React.useCallback(() => {
    const current = pressedRef.current;

    const next = getNextPressedRef.current
      ? getNextPressedRef.current(current)
      : (typeof current === 'boolean' ? !current : current) as unknown as TPressed;

    onCommitRef.current(next);
  }, []);

  const handleKeyboardActivation = React.useCallback(() => {
    if (disabled) return;
    lastActivationWasKeyboardRef.current = true;
    commit();
  }, [disabled, commit]);

  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;

      if (lastActivationWasKeyboardRef.current) {
        lastActivationWasKeyboardRef.current = false;
        return;
      }

      if (isDefaultPrevented(event)) {
        return;
      }

      commit();
    },
    [disabled, commit],
  );
  const handleAccessibilityActivation = React.useCallback(() => {
    if (disabled) return;
    commit();
  }, [disabled, commit]);

  return {
    handlePress,
    handleKeyboardActivation,
    handleAccessibilityActivation,
  };
}
