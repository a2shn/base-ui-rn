import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useMeterContext } from './meter-context';
import type { MeterIndicatorProps } from './types';

/**
 * Visualizes the meter's current value.
 *
 * Automatically applies the width based on the meter's percentage.
 * Hidden from accessibility as it's purely visual.
 *
 * @example
 * ```tsx
 * <Meter.Indicator style={{ backgroundColor: 'blue' }} />
 * ```
 */
export const MeterIndicator = React.memo(
  React.forwardRef<View, MeterIndicatorProps>((props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-labelledby': ariaLabelledBy,
      style,
      ...other
    } = props;
    const { percentage } = useMeterContext();

    const indicatorStyle = React.useMemo<ViewStyle>(() => {
      return {
        width: `${percentage}%`,
      };
    }, [percentage]);

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
        style={[indicatorStyle, style]}
      />
    );
  }),
);

MeterIndicator.displayName = 'Meter.Indicator';
