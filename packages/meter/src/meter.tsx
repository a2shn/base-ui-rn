import * as React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
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
      ...other
    } = props;

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
      }),
      [value, min, max, percentage, formattedValue, ariaValueText],
    );

    return (
      <MeterContext.Provider value={contextValue}>
        <View
          {...other}
          ref={ref}
          accessible={accessible}
          accessibilityRole={accessibilityRole}
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
 */
export const MeterLabel = React.forwardRef<Text, MeterLabelProps>(
  (props, ref) => {
    const { children, ...other } = props;
    return (
      <Text {...other} ref={ref}>
        {children}
      </Text>
    );
  },
);

MeterLabel.displayName = 'Meter.Label';

/**
 * Contains the meter indicator and represents the entire range of the meter.
 */
export const MeterTrack = React.forwardRef<View, MeterTrackProps>(
  (props, ref) => {
    const { children, ...other } = props;
    return (
      <View {...other} ref={ref}>
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
      />
    );
  },
);

MeterIndicator.displayName = 'Meter.Indicator';

/**
 * A text element displaying the current value.
 */
export const MeterValue = React.forwardRef<Text, MeterValueProps>(
  (props, ref) => {
    const { children, ...other } = props;
    const { value, formattedValue } = useMeterContext();

    return (
      <Text {...other} ref={ref}>
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
