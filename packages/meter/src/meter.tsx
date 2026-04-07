import { mergeProps, resolveValue } from '@base-ui-rn/core';
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
      children,
      style,
      ...otherProps
    } = props;

    const { accessibilityProps, state } = useMeter(props);
    const resolvedStyle = resolveValue(style, state)

    const mergedProps = mergeProps(
    { style: resolvedStyle },
    { ref },
    otherProps,
    {
      accessibilityLiveRegion: "none",
      accessible: true,
      focusable: false,
      importantForAccessibility: "yes",
      role: "progressbar"
    }
  );

    return (
      <MeterContext.Provider value={state}>
        <View
          {...mergedProps}

          accessibilityValue={accessibilityProps}
        >
          {resolveValue(children, state)}
        </View>
      </MeterContext.Provider>
    );
  }),
);

MeterRoot.displayName = 'Meter.Root';
