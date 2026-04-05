import { useControllableState } from '@base-ui-rn/core';
import * as React from 'react';

import type { MeterRootProps, MeterState } from './types';

export function useMeter(props: MeterRootProps) {
  const {
    defaultValue = 0,
    format,
    getAccessibilityValueText,
    max = 100,
    high = max,
    locale,
    min = 0,
    low = min,
    optimum = (min + max) / 2,
    value: controlledValue,
  } = props;

  const [value = 0] = useControllableState<number>({
    defaultProp: defaultValue,
    prop: controlledValue,
  });

  const labelId = React.useId();

  const percentage = React.useMemo(() => {
    const range = max - min;
    if (range <= 0) return value >= max ? 100 : 0;
    const ratio = (value - min) / range;
    return Math.min(Math.max(ratio, 0), 1) * 100;
  }, [value, min, max]);

  const status = React.useMemo((): MeterState['status'] => {
    if (value < low) return 'low';
    if (value > high) return 'high';
    return 'optimum';
  }, [value, low, high]);

  const formattedValue = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, format).format(value);
    } catch {
      return String(value);
    }
  }, [value, locale, format]);

  const accessibilityValueText = React.useMemo(() => {
    if (getAccessibilityValueText) {
      return getAccessibilityValueText(formattedValue, value);
    }
    return formattedValue;
  }, [formattedValue, getAccessibilityValueText, value]);

  const state: MeterState = React.useMemo(
    () => ({
      formattedValue,
      high,
      low,
      max,
      min,
      optimum,
      percentage,
      status,
      value,
    }),
    [formattedValue, high, low, max, min, optimum, percentage, status, value],
  );

  return {
    accessibilityProps: {
      max,
      min,
      now: value,
      text: accessibilityValueText,
    },
    labelId,
    state,
  };
}
