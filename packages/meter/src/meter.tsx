import { resolveTabIndex } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { MeterContext } from './meter-context';
import type { MeterRootProps } from './types';
import { useMeterRoot } from './use-meter-root';

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
      accessibilityHint = 'Displays a value within a range',
      accessibilityLabel,
      accessibilityRole = 'progressbar',
      accessible = true,
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-labelledby': ariaLabelledBy,
      children,
      focusable = false,
      importantForAccessibility = 'yes',
      max = 100,
      min = 0,
      tabIndex,
      value,
      ...otherViewProps
    } = props;

    const {
      ariaValueText,
      formattedValue,
      labelId,
      mergedAccessibilityState,
      percentage,
    } = useMeterRoot(props);

    const contextValue = React.useMemo(
      () => ({
        ariaValueText,
        formattedValue,
        labelId,
        max,
        min,
        percentage,
        value,
      }),
      [value, min, max, percentage, formattedValue, ariaValueText, labelId],
    );

    const resolvedTabIndex = resolveTabIndex(false, tabIndex);
    const isLabelledByProp = Boolean(accessibilityLabel);

    return (
      <MeterContext.Provider value={contextValue}>
        <View
          {...otherViewProps}
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel}
          accessibilityLabelledBy={isLabelledByProp ? undefined : [labelId]}
          accessibilityState={mergedAccessibilityState}
          accessibilityValue={
            ariaValueText
              ? { text: ariaValueText }
              : {
                  max,
                  min,
                  now: value,
                }
          }
          accessible={accessible}
          aria-busy={ariaBusy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-hidden={ariaHidden}
          aria-labelledby={
            ariaLabelledBy ?? (isLabelledByProp ? undefined : labelId)
          }
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={value}
          aria-valuetext={ariaValueText}
          focusable={focusable}
          importantForAccessibility={importantForAccessibility}
          ref={ref}
          role={(accessibilityRole ?? 'progressbar') as unknown as 'checkbox'}
          tabIndex={resolvedTabIndex}
        >
          {children}
        </View>
      </MeterContext.Provider>
    );
  }),
);

MeterRoot.displayName = 'Meter.Root';
