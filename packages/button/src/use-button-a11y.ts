import {
  mergeAccessibilityActions,
  mergeAccessibilityState,
} from '@base-ui-rn/core';
import * as React from 'react';

import type { ButtonProps } from './types';

interface UseButtonA11yOptions {
  props: ButtonProps;
  isDisabled: boolean;
  isFocusable: boolean;
  pressed: boolean;
}

export const useButtonA11y = ({
  isDisabled,
  isFocusable,
  pressed,
  props,
}: UseButtonA11yOptions) => {
  const {
    accessibilityActions,
    accessibilityElementsHidden,
    accessibilityHint,
    accessibilityLabel,
    accessibilityLanguage,
    accessibilityLiveRegion,
    accessibilityState,
    accessibilityValue,
    onAccessibilityEscape,
    onPress,
  } = props;

  if (__DEV__) {
    if (
      accessibilityLabel &&
      accessibilityHint &&
      accessibilityLabel === accessibilityHint
    ) {
      console.warn(
        '[Button] accessibilityLabel and accessibilityHint are identical. ' +
          'Screen readers announce both — the hint should describe the outcome, ' +
          'not repeat the label.',
      );
    }

    if (!onPress && !isDisabled) {
      console.warn(
        '[Button] No onPress handler provided on an enabled button. ' +
          'If this is intentional, set disabled.',
      );
    }
  }

  const mergedActions = React.useMemo(() => {
    const defaultActions = !isDisabled ? [{ name: 'activate' }] : [];
    return mergeAccessibilityActions(defaultActions, accessibilityActions);
  }, [accessibilityActions, isDisabled]);

  const mergedState = React.useMemo(() => {
    const baseState = {
      ...accessibilityState,
      ...(pressed && { selected: true }),
    };
    return mergeAccessibilityState(baseState, isDisabled);
  }, [accessibilityState, isDisabled, pressed]);

  return {
    accessibilityActions: mergedActions,
    accessibilityElementsHidden,
    accessibilityHint: accessibilityHint ?? 'Activates the button',
    accessibilityLabel,
    accessibilityLanguage,
    accessibilityLiveRegion: accessibilityLiveRegion ?? 'none',
    accessibilityState: mergedState,
    accessibilityValue,
    accessible: true as const,
    importantForAccessibility: isFocusable
      ? ('yes' as const)
      : ('no-hide-descendants' as const),
    onAccessibilityEscape,
    role: 'button' as const,
  };
};
