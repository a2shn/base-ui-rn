import { DEFAULT_FOCUS_RING_STYLE } from '@base-ui-rn/core';
import { Platform } from 'react-native';
import * as React from 'react';

import { getInteractionModality } from './modality';
import type { UseFocusRingOptions, UseFocusRingReturn } from './types';

/**
 * A hook that manages focus state and focus-visible logic.
 *
 * @param options Options for the focus ring hook (all required).
 * @returns An object containing the current focus state, event handlers, and focus ring style.
 */
export function useFocusRing(options: UseFocusRingOptions): UseFocusRingReturn {
  const { disabled, focusableWhenDisabled, disableDefaultFocusRing } = options;
  const [focused, setFocused] = React.useState(false);
  const [isFocusVisible, setFocusVisible] = React.useState(false);

  const isFocusable = React.useMemo(
    () => !disabled || focusableWhenDisabled,
    [disabled, focusableWhenDisabled],
  );

  const onFocus = React.useCallback(() => {
    if (!isFocusable) return;
    const modality = getInteractionModality();
    const isVisible = Platform.OS !== 'web' || modality === 'keyboard';

    setFocused(true);
    setFocusVisible(isVisible);
  }, [isFocusable]);

  const onBlur = React.useCallback(() => {
    setFocused(false);
    setFocusVisible(false);
  }, []);

  const focusRingStyle = React.useMemo(() => {
    if (disableDefaultFocusRing) {
      return null;
    }
    return isFocusVisible ? DEFAULT_FOCUS_RING_STYLE : null;
  }, [disableDefaultFocusRing, isFocusVisible]);

  return React.useMemo(
    () => ({
      focused,
      onBlur,
      onFocus,
      focusRingStyle,
    }),
    [focused, onFocus, onBlur, focusRingStyle],
  );
}
