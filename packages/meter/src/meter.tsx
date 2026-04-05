import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { MeterContext } from './meter-context';
import type { MeterRootProps } from './types';
import { useMeter } from './use-meter';

/**
 * Headless meter root primitive for React Native.
 *
 * Measures a value within a known range and provides state to its sub-components.
 * Supports localization, custom value formatting, and ARIA attributes.
 *
 * @example
 * ```tsx
 * <Meter.Root value={50}>
 * <Meter.Label>Storage</Meter.Label>
 * <Meter.Track><Meter.Indicator /></Meter.Track>
 * </Meter.Root>
 * ```
 */
export const MeterRoot = React.memo(
  React.forwardRef<View, MeterRootProps>((props, ref) => {
    const {
      accessibilityLabel,
      accessibilityLiveRegion,
      accessible,
      children,
      style,
    } = props;

    const { accessibilityProps, labelId, state } = useMeter(props);

    const contextValue = React.useMemo(
      () => ({ ...state, labelId }),
      [state, labelId],
    );

    const resolvedStyle = useStyle({ state, style });

    const mergedProps = mergeProps(props, {
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    return (
      <MeterContext.Provider value={contextValue}>
        <View
          accessibilityLabelledBy={accessibilityLabel ? undefined : [labelId]}
          accessibilityLiveRegion={accessibilityLiveRegion ?? 'none'}
          accessibilityValue={accessibilityProps}
          accessible={accessible ?? true}
          importantForAccessibility='yes'
          role='progressbar'
          {...mergedProps}
        >
          {evaluateStyles(children, state)}
        </View>
      </MeterContext.Provider>
    );
  }),
);

MeterRoot.displayName = 'Meter.Root';
