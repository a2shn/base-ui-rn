import * as React from 'react';
import { Text } from 'react-native';

import { useMeterContext } from './meter-context';
import type { MeterValueProps } from './types';

/**
 * A text element displaying the current value of the meter.
 *
 * Hidden from accessibility to avoid redundant announcements.
 *
 * @example
 * ```tsx
 * <Meter.Value />
 * ```
 */
export const MeterValue = React.memo(
  React.forwardRef<Text, MeterValueProps>((props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-labelledby': ariaLabelledBy,
      children,
      ...other
    } = props;
    const { formattedValue, value } = useMeterContext();

    return (
      <Text
        {...other}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden ?? true}
        aria-labelledby={ariaLabelledBy}
        importantForAccessibility='no-hide-descendants'
        ref={ref}
      >
        {typeof children === 'function'
          ? children(formattedValue, value)
          : formattedValue}
      </Text>
    );
  }),
);

MeterValue.displayName = 'Meter.Value';
