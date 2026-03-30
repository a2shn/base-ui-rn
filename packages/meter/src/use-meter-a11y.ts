import { mergeAccessibilityState } from '@base-ui-rn/core';
import * as React from 'react';

import type { MeterRootProps, MeterState } from './types';

interface UseMeterA11yOptions {
  props: MeterRootProps;
  state: MeterState;
  labelId: string;
}

export function useMeterA11y({
  labelId,
  props,
  state,
}: UseMeterA11yOptions) {
  const {
    accessibilityLabel,
    accessibilityState,
    accessibilityValue,
    getAccessibilityValueText,
  } = props;

  const { formattedValue, max, min, value } = state;

  if (__DEV__) {
    if (
      accessibilityLabel &&
      props.accessibilityHint &&
      accessibilityLabel === props.accessibilityHint
    ) {
      console.warn('[Meter.Root] accessibilityLabel and accessibilityHint are identical.');
    }
  }

  const accessibilityValueText = React.useMemo(() => {
    if (getAccessibilityValueText) {
      return getAccessibilityValueText(formattedValue, value);
    }
    return formattedValue;
  }, [formattedValue, getAccessibilityValueText, value]);

  const mergedValue = React.useMemo(
    () => ({
      ...accessibilityValue,
      max,
      min,
      now: value,
      text: accessibilityValueText,
    }),
    [accessibilityValue, accessibilityValueText, max, min, value],
  );

  const mergedState = React.useMemo(
    () => mergeAccessibilityState(accessibilityState, false),
    [accessibilityState],
  );

  return {
    accessibilityLabel,
    accessibilityLabelledBy: accessibilityLabel ? undefined : [labelId],
    accessibilityLiveRegion:
      (props.accessibilityLiveRegion as 'none' | 'polite' | 'assertive') ??
      'none',
    accessibilityState: mergedState,
    accessibilityValue: mergedValue,
    accessible: props.accessible ?? true,
    importantForAccessibility: 'yes' as const,
    role: 'progressbar' as const,
  };
}
