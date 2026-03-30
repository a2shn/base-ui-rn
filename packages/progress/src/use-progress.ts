import * as React from 'react';

import type { ProgressRootProps, ProgressState } from './types';

export function useProgress(props: ProgressRootProps) {
  const { format, locale, max = 100, min = 0, value = null } = props;

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

  const state: ProgressState = {
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
    state,
  };
}
