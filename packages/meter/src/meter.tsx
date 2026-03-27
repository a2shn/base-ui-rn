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
      accessibilityHint,
      accessibilityLabel: accessibilityLabelProp,
      accessible = true,
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-valuetext': ariaValueTextProp,
      children,
      max = 100,
      min = 0,
      value,
      ...otherViewProps
    } = props;

    const hasCustomLabel = !!(ariaLabel || accessibilityLabelProp);

    const { ariaValueText, formattedValue, labelId, percentage } =
      useMeterRoot(props);

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

    const resolvedAriaLabelledBy = hasCustomLabel
      ? undefined
      : (ariaLabelledBy ?? labelId);

    return (
      <MeterContext.Provider value={contextValue}>
        <View
          {...otherViewProps}
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabelProp}
          accessibilityLabelledBy={
            hasCustomLabel
              ? undefined
              : resolvedAriaLabelledBy
                ? [resolvedAriaLabelledBy]
                : undefined
          }
          accessibilityState={{ disabled: false }}
          accessibilityValue={
            (ariaValueText ?? ariaValueTextProp)
              ? { text: ariaValueText ?? ariaValueTextProp }
              : { max, min, now: value }
          }
          accessible={accessible}
          aria-busy={ariaBusy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={hasCustomLabel ? undefined : resolvedAriaLabelledBy}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={value}
          aria-valuetext={ariaValueText ?? ariaValueTextProp}
          focusable={false}
          importantForAccessibility='yes'
          ref={ref}
          role='progressbar'
        >
          {children}
        </View>
      </MeterContext.Provider>
    );
  }),
);

MeterRoot.displayName = 'Meter.Root';
