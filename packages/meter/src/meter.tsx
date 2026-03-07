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
import { useMeterRoot } from './use-meter-root';

/**
 * Headless meter primitive for React Native.
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
      accessibilityHint = 'Displays a value within a range',
      accessibilityState,
      accessibilityLabel,
      focusable = false,
      importantForAccessibility = 'yes',
      tabIndex,
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
          aria-labelledby={isLabelledByProp ? undefined : labelId}
          accessibilityLabelledBy={isLabelledByProp ? undefined : [labelId]}
          tabIndex={resolvedTabIndex}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={ariaValueText}
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

export const MeterLabel = React.forwardRef<Text, MeterLabelProps>(
  (props, ref) => {
    const { children, nativeID, ...other } = props;
    const { labelId } = useMeterContext();

    return (
      <Text {...other} ref={ref} nativeID={nativeID ?? labelId}>
        {children}
      </Text>
    );
  },
);

MeterLabel.displayName = 'Meter.Label';

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
