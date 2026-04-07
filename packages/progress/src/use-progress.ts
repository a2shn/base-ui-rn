import { useControllableState, useFormatter } from '@base-ui-rn/core';
import * as React from 'react';

import type { ProgressRootProps, ProgressState } from './types';

export function useProgress(props: ProgressRootProps) {
  const {
    format,
    getAccessibilityValueText,
    locale,
    max = 100,
    min = 0,
    value: controlledValue,
    defaultValue = 0,
  } = props;

  const [value = null] = useControllableState<number | null>({
    prop: controlledValue,
    defaultProp: defaultValue,
  });

  const labelId = React.useId();

  const isIndeterminate = value === null;
  const isComplete = value !== null && value >= max;
  const isProgressing = value !== null && value < max;

  const percentage = React.useMemo(() => {
    if (value === null) return null;

    const range = max - min;
    if (range <= 0) {
      return value >= max ? 100 : 0;
    }

    const ratio = (value - min) / range;
    const clampedRatio = Math.min(Math.max(ratio, 0), 1);

    return clampedRatio * 100;
  }, [value, min, max]);

  const { formattedValues } = useFormatter(
    React.useMemo(() => (value === null ? [] : [value]), [value]),
    {
      formatOptions: format,
      locale,
    },
  );

  const formattedValue =
    value === null ? null : (formattedValues[0] ?? String(value));

  const state: ProgressState = React.useMemo(
    () => ({
      formattedValue,
      isComplete,
      isIndeterminate,
      isProgressing,
      max,
      min,
      percentage,
      value,
    }),
    [
      formattedValue,
      isComplete,
      isIndeterminate,
      isProgressing,
      max,
      min,
      percentage,
      value,
    ],
  );

  const accessibilityValueText = React.useMemo(() => {
    if (getAccessibilityValueText) {
      return getAccessibilityValueText(formattedValue, value);
    }
    return formattedValue ?? undefined;
  }, [formattedValue, getAccessibilityValueText, value]);

  const accessibilityProps = React.useMemo(
    () => ({
      max: isIndeterminate ? undefined : max,
      min: isIndeterminate ? undefined : min,
      now: isIndeterminate ? undefined : (value ?? undefined),
      text: accessibilityValueText,
    }),
    [accessibilityValueText, isIndeterminate, max, min, value],
  );

  return {
    accessibilityProps,
    labelId,
    state,
  };
}
