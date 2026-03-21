import { mergeAccessibilityState } from '@base-ui-rn/core';
import * as React from 'react';

import type { ProgressRootProps, ProgressState } from './types';

export const useProgress = (props: ProgressRootProps) => {
  const {
    accessibilityState,
    'aria-valuetext': ariaValueTextProp,
    format,
    getAriaValueText,
    locale,
    max = 100,
    min = 0,
    value = null,
  } = props;
  const labelId = React.useId();

  const isIndeterminate = value == null;
  const isComplete = !isIndeterminate && value! >= max;
  const isProgressing = !isIndeterminate && !isComplete;

  const percentage = React.useMemo(() => {
    if (isIndeterminate) return null;
    return Math.min(Math.max((value! - min) / (max - min), 0), 1) * 100;
  }, [value, min, max, isIndeterminate]);

  const formattedValue = React.useMemo(() => {
    if (isIndeterminate) return null;
    try {
      return new Intl.NumberFormat(locale, format).format(value!);
    } catch {
      return String(value);
    }
  }, [value, locale, format, isIndeterminate]);

  const ariaValueText = React.useMemo(() => {
    if (ariaValueTextProp) return ariaValueTextProp;
    if (getAriaValueText)
      return getAriaValueText(formattedValue, value ?? null);
    return formattedValue ?? undefined;
  }, [ariaValueTextProp, getAriaValueText, value, formattedValue]);

  const mergedAccessibilityState = React.useMemo(
    () =>
      mergeAccessibilityState(
        accessibilityState as Record<string, unknown> | undefined,
        false,
      ),
    [accessibilityState],
  );

  const state: ProgressState = {
    ariaValueText,
    formattedValue,
    isComplete,
    isIndeterminate,
    isProgressing,
    max,
    min,
    percentage,
    value: value ?? null,
  };

  return {
    labelId,
    mergedAccessibilityState,
    state,
  };
};
