import * as React from 'react';
import { View } from 'react-native';
import type { MeterTrackProps } from './types';

export const MeterTrack = React.forwardRef<View, MeterTrackProps>(
  (props, ref) => {
    const {
      children,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...other
    } = props;
    return (
      <View
        {...other}
        ref={ref}
        importantForAccessibility='no-hide-descendants'
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? true}
      >
        {children}
      </View>
    );
  },
);

MeterTrack.displayName = 'Meter.Track';
