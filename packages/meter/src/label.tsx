import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
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
    const { children, nativeID, style } = props;
    const context = useMeterContext();
    const { labelId } = context;

    const resolvedStyle = useStyle({
      state: context,
      style,
    });

    const mergedProps = mergeProps(props, {
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    return (
      <Text nativeID={nativeID ?? labelId} {...mergedProps}>
        {evaluateStyles(children, context)}
      </Text>
    );
  }),
);

MeterLabel.displayName = 'Meter.Label';
