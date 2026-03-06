import * as React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { resolveTabIndex } from '@base-ui-rn/core';
import type {
  MeterRootProps,
  MeterLabelProps,
  MeterTrackProps,
  MeterIndicatorProps,
  MeterValueProps,
} from './types';
import { MeterContext, useMeterContext } from './meter-context';

/**
 * Headless meter primitive for React Native.
 *
 * @example
 * ```tsx
 * <Meter.Root value={24}>
 *   <Meter.Label>Storage Used</Meter.Label>
 *   <Meter.Track>
 *     <Meter.Indicator style={{ width: '24%' }} />
 *   </Meter.Track>
 *   <Meter.Value />
 * </Meter.Root>
 * ```
 */
export const MeterRoot = React.forwardRef<View, MeterRootProps>(
  (props, ref) => {
    const {
      children,
      value,
      min = 0,
      max = 100,
      'aria-valuetext': ariaValueTextProp,
      getAriaValueText,
      locale,
      format,
      accessible = true,
      accessibilityRole = 'progressbar',
      tabIndex,
      ...other
    } = props;

    const labelId = React.useId();

    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1) * 100;

    const formattedValue = React.useMemo(() => {
      try {
        return new Intl.NumberFormat(locale, format).format(value);
      } catch (e) {
        return String(value);
      }
    }, [value, locale, format]);

    const ariaValueText = React.useMemo(() => {
      if (ariaValueTextProp) return ariaValueTextProp;
      if (getAriaValueText) return getAriaValueText(value, min, max);
      return undefined;
    }, [ariaValueTextProp, getAriaValueText, value, min, max]);

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

    return (
      <MeterContext.Provider value={contextValue}>
        <View
          {...other}
          ref={ref}
          accessible={accessible}
          role={(accessibilityRole ?? 'progressbar') as unknown as 'checkbox'}
          aria-labelledby={other.accessibilityLabel ? undefined : labelId}
          tabIndex={resolvedTabIndex}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={ariaValueText}
          accessibilityValue={{
            min,
            max,
            now: value,
            text: ariaValueText,
          }}
        >
          {children}
        </View>
      </MeterContext.Provider>
    );
  },
);

MeterRoot.displayName = 'Meter.Root';

/**
 * An accessible label for the meter.
 * 
 * Automatically linked to the `Meter.Root` via `aria-labelledby`.
 * Hidden from accessibility to avoid redundant announcements.
 */
export const MeterLabel = React.forwardRef<Text, MeterLabelProps>(
  (props, ref) => {
    const { children, nativeID, ...other } = props;
    const { labelId } = useMeterContext();

    return (
      <Text
        {...other}
        ref={ref}
        nativeID={nativeID ?? labelId}
        importantForAccessibility='no-hide-descendants'
        aria-hidden
      >
        {children}
      </Text>
    );
  },
);

MeterLabel.displayName = 'Meter.Label';

/**
 * Contains the meter indicator and represents the entire range of the meter.
 * 
 * Hidden from accessibility as it's purely visual.
 */
export const MeterTrack = React.forwardRef<View, MeterTrackProps>(
  (props, ref) => {
    const { children, ...other } = props;
    return (
      <View
        {...other}
        ref={ref}
        importantForAccessibility='no-hide-descendants'
        aria-hidden
      >
        {children}
      </View>
    );
  },
);

MeterTrack.displayName = 'Meter.Track';

/**
 * Visualizes the position of the value along the range.
 *
 * Automatically applies the width (or height if vertical) based on the meter's value.
 * Hidden from accessibility as it's purely visual.
 */
export const MeterIndicator = React.forwardRef<View, MeterIndicatorProps>(
  (props, ref) => {
    const { style, ...other } = props;
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
        aria-hidden
      />
    );
  },
);

MeterIndicator.displayName = 'Meter.Indicator';

/**
 * A text element displaying the current value.
 * 
 * Hidden from accessibility to avoid redundant announcements, as the value is 
 * provided by `Meter.Root`'s `accessibilityValue`.
 */
export const MeterValue = React.forwardRef<Text, MeterValueProps>(
  (props, ref) => {
    const { children, ...other } = props;
    const { value, formattedValue } = useMeterContext();

    return (
      <Text
        {...other}
        ref={ref}
        importantForAccessibility='no-hide-descendants'
        aria-hidden
      >
        {typeof children === 'function'
          ? children(formattedValue, value)
          : formattedValue}
      </Text>
    );
  },
);

MeterValue.displayName = 'Meter.Value';

export const Meter = {
  Root: MeterRoot,
  Label: MeterLabel,
  Track: MeterTrack,
  Indicator: MeterIndicator,
  Value: MeterValue,
};
