import { useA11y } from '@base-ui-rn/core';
import * as React from 'react';

import type { MeterRootProps, MeterState } from './types';

interface UseMeterA11yOptions {
  props: MeterRootProps;
  state: MeterState;
  labelId: string;
}

export function useMeterA11y({ labelId, props, state }: UseMeterA11yOptions) {
  const { accessibilityValue, getAccessibilityValueText } = props;
  const { formattedValue, max, min, value } = state;

  if (__DEV__) {
    if (
      props.accessibilityLabel &&
      props.accessibilityHint &&
      props.accessibilityLabel === props.accessibilityHint
    ) {
      console.warn(
        '[Meter.Root] accessibilityLabel and accessibilityHint are identical.',
      );
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
      max,
      min,
      now: value,
      text: accessibilityValueText,
      ...accessibilityValue,
    }),
    [accessibilityValue, accessibilityValueText, max, min, value],
  );

  return useA11y(props, {
    accessibilityLabelledBy: props.accessibilityLabel ? undefined : [labelId],
    accessibilityLiveRegion: props.accessibilityLiveRegion ?? 'none',
    accessibilityValue: mergedValue,
    accessible: props.accessible ?? true,
    importantForAccessibility: 'yes',
    role: 'progressbar',
  });
}
