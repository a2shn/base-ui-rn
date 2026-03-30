import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { MeterContext } from './meter-context';
import type { MeterRootProps } from './types';
import { useMeter } from './use-meter';
import { useMeterA11y } from './use-meter-a11y';

/**
 * Headless meter root primitive for React Native.
 *
 * Measures a value within a known range and provides state to its sub-components.
 * Supports localization, custom value formatting, and ARIA attributes.
 *
 * @example
 * ```tsx
 * <Meter.Root value={50}>
 *   <Meter.Label>Storage</Meter.Label>
 *   <Meter.Track><Meter.Indicator /></Meter.Track>
 * </Meter.Root>
 * ```
 */
export const MeterRoot = React.memo(
  React.forwardRef<View, MeterRootProps>((props, ref) => {
    const {
      children,
      format,
      getAccessibilityValueText,
      locale,
      max,
      min,
      style,
      value,
      ...viewProps
    } = props;

    const { labelId, state } = useMeter(props);
    const a11yProps = useMeterA11y({ labelId, props, state });

    const contextValue = React.useMemo(
      () => ({
        ...state,
        labelId,
      }),
      [state, labelId],
    );

    const resolvedStyle = evaluateStyles(style, state);
    const resolvedChildren = evaluateStyles(children, state);

    return (
      <MeterContext.Provider value={contextValue}>
        <View
          {...viewProps}
          {...a11yProps}
          focusable={false}
          ref={ref}
          style={resolvedStyle}
        >
          {resolvedChildren}
        </View>
      </MeterContext.Provider>
    );
  }),
);

MeterRoot.displayName = 'Meter.Root';
