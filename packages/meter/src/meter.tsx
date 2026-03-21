import * as React from 'react';
import { View } from 'react-native';
import { resolveTabIndex } from '@base-ui-rn/core';
import type { MeterRootProps } from './types';
import { MeterContext } from './meter-context';
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
      children,
      value,
      min = 0,
      max = 100,
      getAriaValueText,
      locale,
      format,
      accessible = true,
      accessibilityRole = 'progressbar',
      accessibilityHint = 'Displays a value within a range',
      accessibilityState,
      accessibilityLabel,
      focusable = false,
      importantForAccessibility = 'yes',
      tabIndex,
      'aria-valuetext': ariaValueTextProp,
      'aria-valuemin': ariaValueMin,
      'aria-valuemax': ariaValueMax,
      'aria-valuenow': ariaValueNow,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherViewProps
    } = props;

    const {
      ariaValueText,
      formattedValue,
      labelId,
      mergedAccessibilityState,
      percentage,
    } = useMeterRoot({
      value,
      min,
      max,
      locale,
      format,
      ariaValueTextProp,
      getAriaValueText,
      accessibilityState,
    });

    const contextValue = React.useMemo(
      () => ({
        value,
        min,
        max,
        percentage,
        formattedValue,
        ariaValueText,
        labelId,
      }),
      [value, min, max, percentage, formattedValue, ariaValueText, labelId],
    );

    const resolvedTabIndex = resolveTabIndex(false, tabIndex);
    const isLabelledByProp = Boolean(accessibilityLabel);

    return (
      <MeterContext.Provider value={contextValue}>
        <View
          {...otherViewProps}
          ref={ref}
          accessible={accessible}
          accessibilityHint={accessibilityHint}
          accessibilityState={mergedAccessibilityState}
          accessibilityLabel={accessibilityLabel}
          focusable={focusable}
          importantForAccessibility={importantForAccessibility}
          role={(accessibilityRole ?? 'progressbar') as unknown as 'checkbox'}
          aria-labelledby={
            ariaLabelledBy ?? (isLabelledByProp ? undefined : labelId)
          }
          accessibilityLabelledBy={isLabelledByProp ? undefined : [labelId]}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          tabIndex={resolvedTabIndex}
          aria-valuemin={ariaValueMin ?? min}
          aria-valuemax={ariaValueMax ?? max}
          aria-valuenow={ariaValueNow ?? value}
          aria-valuetext={ariaValueTextProp ?? ariaValueText}
          accessibilityValue={
            ariaValueText
              ? { text: ariaValueText }
              : {
                min,
                max,
                now: value,
              }
          }
        >
          {children}
        </View>
      </MeterContext.Provider>
    );
  },
);

MeterRoot.displayName = 'Meter.Root';
