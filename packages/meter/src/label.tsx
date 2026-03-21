import * as React from 'react';
import { Text } from 'react-native';
import type { MeterLabelProps } from './types';
import { useMeterContext } from './meter-context';

/**
 * An accessible label for the meter.
 *
 * Automatically linked to the `Meter.Root` via context.
 *
 * @example
 * ```tsx
 * <Meter.Label>Storage Used</Meter.Label>
 * ```
 */
export const MeterLabel = React.memo(
  React.forwardRef<Text, MeterLabelProps>((props, ref) => {
    const {
      children,
      nativeID,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...other
    } = props;
    const { labelId } = useMeterContext();

    return (
      <Text
        {...other}
        ref={ref}
        nativeID={nativeID ?? labelId}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
      >
        {children}
      </Text>
    );
  },
);

MeterLabel.displayName = 'Meter.Label';
