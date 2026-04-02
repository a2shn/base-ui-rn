import { DEFAULT_FOCUS_RING_STYLE } from './styles';
import * as React from 'react';
import { Platform } from 'react-native';

import { getInteractionModality } from './modality';
import type { UseFocusRingOptions, UseFocusRingReturn } from './types';


/**
 * A hook that manages focus state and focus-visible logic.
 *
 * @param options Options for the focus ring hook (all required).
 * @returns An object containing the current focus state, event handlers, and focus ring style.
 */
export function useFocusRing(options: UseFocusRingOptions): UseFocusRingReturn {
  const { disabled, disableDefaultFocusRing, focusableWhenDisabled } = options;
  const [focused, setFocused] = React.useState(false);
  const [focusVisible, setFocusVisible] = React.useState(false);

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
    return focusVisible ? DEFAULT_FOCUS_RING_STYLE : null;
  }, [disableDefaultFocusRing, focusVisible]);

  return React.useMemo(
    () => ({
      focused,
      focusVisible,
      focusRingStyle,
      isFocusable,
      onBlur,
      onFocus,
    }),
    [focused, focusVisible, onFocus, onBlur, focusRingStyle, isFocusable],
  );
}
