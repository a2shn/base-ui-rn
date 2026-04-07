import { mergeProps, resolveValue } from '@base-ui-rn/core';
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
    const { children, style, ...otherProps } = props;
    const context = useMeterContext();
    const { formattedValue } = context;

    const resolvedStyle = resolveValue(style, context)
    const mergedProps = mergeProps(otherProps, {
      focusable: false,
      ref,
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
      style: resolvedStyle,
    });

    return (
      <Text
        {...mergedProps}
      >
        {resolveValue(children, context) ?? formattedValue}
      </Text>
    );
  }),
);

MeterValue.displayName = 'Meter.Value';
