import * as React from 'react';
import { View, type ViewStyle } from 'react-native';
import type { MeterIndicatorProps } from './types';
import { useMeterContext } from './meter-context';

export const MeterIndicator = React.forwardRef<View, MeterIndicatorProps>(
  (props, ref) => {
    const {
      style,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
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
        ref={ref}
        style={[indicatorStyle, style]}
        importantForAccessibility='no-hide-descendants'
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? true}
      />
    );
  },
);

MeterIndicator.displayName = 'Meter.Indicator';
