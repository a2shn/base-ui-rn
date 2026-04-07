import { useControllableState, useFormatter } from '@base-ui-rn/core';
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

  const { formattedValues } = useFormatter(
    React.useMemo(() => [value], [value]),
    {
      formatOptions: format,
      locale,
    },
  );

  const formattedValue = formattedValues[0] ?? String(value);

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
    state,
  };
}
