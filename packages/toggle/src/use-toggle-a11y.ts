import {
  mergeAccessibilityActions,
  mergeAccessibilityState,
} from '@base-ui-rn/core';
import * as React from 'react';

import type { ToggleProps, ToggleState } from './types';

interface UseToggleA11yOptions {
  props: ToggleProps;
  state: ToggleState;
  isFocusable: boolean;
}

export function useToggleA11y({
  props,
  state,
}: UseToggleA11yOptions) {
  const {
    accessibilityActions,
    accessibilityHint,
    accessibilityLabel,
    accessibilityState,
    accessibilityValue,
  } = props;

  const { disabled, pressed } = state;

  if (__DEV__) {
    if (
      accessibilityLabel &&
      accessibilityHint &&
      accessibilityLabel === accessibilityHint
    ) {
      console.warn('[Toggle] accessibilityLabel and accessibilityHint are identical.');
    }
  }

  const mergedActions = React.useMemo(
    () =>
      mergeAccessibilityActions([{ name: 'activate' }], accessibilityActions),
    [accessibilityActions],
  );

  const mergedState = React.useMemo(
    () =>
      mergeAccessibilityState(
        {
          ...accessibilityState,
          checked: pressed,
        },
        disabled,
      ),
    [accessibilityState, disabled, pressed],
  );

  return {
    accessibilityActions: mergedActions,
    accessibilityHint,
    accessibilityLabel,
    accessibilityState: mergedState,
    accessibilityValue,
    accessible: true,
    importantForAccessibility: 'yes' as const,
    // Note: We use any here because ToggleProps (from user) omits role, 
    // but tests might pass it via ...otherProps.
    role: (props as any).role ?? 'checkbox',
  };
}
