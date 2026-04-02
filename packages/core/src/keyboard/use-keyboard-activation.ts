import React from 'react';
import { NativeSyntheticEvent } from 'react-native';

import { ACTIVATION_KEYS } from '../constants';
import { KeyDownEventData } from '../types';

export type ActivationKey = (typeof ACTIVATION_KEYS)[number];

const isActivationKey = (key: string): key is ActivationKey => {
  return ACTIVATION_KEYS.includes(key as ActivationKey);
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
): (e: NativeSyntheticEvent<KeyDownEventData> | KeyboardEvent) => void {
  const onActivateRef = React.useRef(onActivate);
  onActivateRef.current = onActivate;

  const isDisabledRef = React.useRef(isDisabled);
  isDisabledRef.current = isDisabled;

  return React.useCallback(
    (e: NativeSyntheticEvent<KeyDownEventData> | KeyboardEvent) => {
      const nativeEvent = (e as NativeSyntheticEvent<KeyDownEventData>)
        .nativeEvent;
      const key = nativeEvent?.key || (e as unknown as KeyDownEventData).key;

      if (!key) return;

      if (isActivationKey(key) && !isDisabledRef.current) {
        if (e.preventDefault) e.preventDefault();
        onActivateRef.current();
      }
    },
    [],
  );
}
