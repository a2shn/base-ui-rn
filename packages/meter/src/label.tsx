import * as React from 'react';
import { Text } from 'react-native';
import type { MeterLabelProps } from './types';
import { useMeterContext } from './meter-context';

export const MeterLabel = React.forwardRef<Text, MeterLabelProps>(
  (props, ref) => {
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
