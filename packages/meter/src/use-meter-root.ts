import * as React from 'react';
import { mergeAccessibilityState } from '@base-ui-rn/core';
import type { MeterRootProps } from './types';

export const useMeterRoot = (props: MeterRootProps) => {
  const {
    value,
    min = 0,
    max = 100,
    locale,
    format,
    'aria-valuetext': ariaValueTextProp,
    getAriaValueText,
    accessibilityState,
  } = props;

  const labelId = React.useId();

  const percentage =
    Math.min(Math.max((value - min) / (max - min), 0), 1) * 100;

  const formattedValue = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, format).format(value);
    } catch {
      return String(value);
    }
  }, [value, locale, format]);

  const ariaValueText = React.useMemo(() => {
    if (ariaValueTextProp) return ariaValueTextProp;
    if (getAriaValueText) return getAriaValueText(value, min, max);
    return formattedValue;
  }, [ariaValueTextProp, getAriaValueText, value, min, max, formattedValue]);

  const mergedAccessibilityState = React.useMemo(
    () =>
      mergeAccessibilityState(
        accessibilityState as Record<string, unknown> | undefined,
        false,
      ),
    [accessibilityState],
  );

  return {
    ariaValueText,
    formattedValue,
    labelId,
    mergedAccessibilityState,
    percentage,
  };
};
