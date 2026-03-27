import * as React from 'react';

import type { MeterRootProps } from './types';

export const useMeterRoot = (props: MeterRootProps) => {
  const {
    'aria-valuetext': ariaValueTextProp,
    format,
    getAriaValueText,
    locale,
    max = 100,
    min = 0,
    value,
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

  return {
    ariaValueText,
    formattedValue,
    labelId,
    percentage,
  };
};
