import * as React from 'react';
import { Text } from 'react-native';

import { useMeterContext } from './meter-context';
import type { MeterLabelProps } from './types';

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
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      nativeID,
      ...otherProps
    } = props;
    const { labelId } = useMeterContext();

    return (
      <Text
        {...otherProps}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        nativeID={nativeID ?? labelId}
        ref={ref}
      >
        {children}
      </Text>
    );
  }),
);

MeterLabel.displayName = 'Meter.Label';
