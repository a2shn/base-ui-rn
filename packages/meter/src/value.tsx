import { evaluateStyles } from '@base-ui-rn/core';
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
    const { children, style } = props;
    const context = useMeterContext();
    const { formattedValue } = context;

    const resolvedChildren = evaluateStyles(children, context);
    const resolvedStyle = evaluateStyles(style, context);

    return (
      <Text
        {...props}
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
        ref={ref}
        style={resolvedStyle}
      >
        {resolvedChildren ?? formattedValue}
      </Text>
    );
  }),
);

MeterValue.displayName = 'Meter.Value';
