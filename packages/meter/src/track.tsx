import * as React from 'react';
import { View } from 'react-native';

import type { MeterTrackProps } from './types';

/**
 * Contains the meter indicator and represents the entire range of the meter.
 *
 * Hidden from accessibility as it's purely visual.
 *
 * @example
 * ```tsx
 * <Meter.Track><Meter.Indicator /></Meter.Track>
 * ```
 */
export const MeterTrack = React.memo(
  React.forwardRef<View, MeterTrackProps>((props, ref) => {
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
    return (
      <View
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
        {children}
      </View>
    );
  }),
);

MeterTrack.displayName = 'Meter.Track';
