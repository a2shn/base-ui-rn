import { mergeAccessibilityState } from '@base-ui-rn/core';
import * as React from 'react';
import type { ProgressRootProps, ProgressState } from './types';

interface UseProgressA11yOptions {
  props: ProgressRootProps;
  state: ProgressState;
  labelId: string;
}

export function useProgressA11y({ labelId, props, state }: UseProgressA11yOptions) {
  const {
    accessibilityLabel,
    accessibilityLiveRegion,
    accessibilityState,
    accessibilityValue,
    getAccessibilityValueText,
  } = props;

  const { formattedValue, isIndeterminate, max, min, value } = state;

  if (__DEV__) {
    if (
      accessibilityLabel &&
      props.accessibilityHint &&
      accessibilityLabel === props.accessibilityHint
    ) {
      console.warn(
        '[Progress.Root] accessibilityLabel and accessibilityHint are identical. ' +
        'The hint should describe the outcome, not repeat the label.',
      );
    }
  }

  const accessibilityValueText = React.useMemo(() => {
    if (getAccessibilityValueText) {
      return getAccessibilityValueText(formattedValue, value);
    }
    return formattedValue ?? undefined;
  }, [formattedValue, getAccessibilityValueText, value]);

  const mergedValue = React.useMemo(
    () => ({
      ...accessibilityValue,
      max: isIndeterminate ? undefined : max,
      min: isIndeterminate ? undefined : min,
      now: isIndeterminate ? undefined : (value ?? undefined),
      text: accessibilityValueText,
    }),
    [accessibilityValue, accessibilityValueText, isIndeterminate, max, min, value],
  );

  const mergedState = React.useMemo(
    () => mergeAccessibilityState(accessibilityState, false),
    [accessibilityState],
  );

  return {
    accessible: true as const,
    importantForAccessibility: 'yes' as const,
    role: 'progressbar' as const,
    accessibilityLabel,
    // Link to Progress.Label when no explicit label is provided
    accessibilityLabelledBy: accessibilityLabel ? undefined : [labelId],
    // 'polite' — announces updates without interrupting the user.
    // Override with 'assertive' for urgent progress (e.g. destructive operations)
    accessibilityLiveRegion: accessibilityLiveRegion ?? 'polite',
    accessibilityValue: mergedValue,
    accessibilityState: mergedState,
  };
}
