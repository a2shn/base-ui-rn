import * as React from 'react';

import type { MeterRootProps, MeterState } from './types';

export function useMeter(props: MeterRootProps) {
  const { format, locale, max = 100, min = 0, value } = props;

  const labelId = React.useId();

  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1) * 100;

  const isComplete = value >= max;

  const formattedValue = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, format).format(value);
    } catch {
      return String(value);
    }
  }, [value, locale, format]);

  const state: MeterState = {
    formattedValue,
    isComplete,
    max,
    min,
    percentage,
    value,
  };

  return {
    labelId,
    state,
  };
}
