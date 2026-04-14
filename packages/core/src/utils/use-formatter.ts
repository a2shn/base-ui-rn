import * as React from 'react';

export interface UseFormatterOptions {
  locale?: Intl.LocalesArgument;
  formatOptions?: Intl.NumberFormatOptions;
}

export function useFormatter(
  values: number[],
  options: UseFormatterOptions = {},
) {
  const { formatOptions, locale } = options;

  const formatter = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, formatOptions);
    } catch {
      return null;
    }
  }, [locale, formatOptions]);

  const formattedValues = React.useMemo(() => {
    return values.map((value) =>
      formatter ? formatter.format(value) : value.toString(),
    );
  }, [values, formatter]);

  return {
    formattedValues,
    formatter,
  };
}
