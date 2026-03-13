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

export const MeterLabel = React.forwardRef<Text, MeterLabelProps>(
  (props, ref) => {
    const {
      children,
      nativeID,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...other
    } = props;
    const { labelId } = useMeterContext();

    return (
      <Text
        {...other}
        ref={ref}
        nativeID={nativeID ?? labelId}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
      >
        {children}
      </Text>
    );
  },
);

MeterLabel.displayName = 'Meter.Label';

export const MeterTrack = React.forwardRef<View, MeterTrackProps>(
  (props, ref) => {
    const {
      children,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...other
    } = props;
    return (
      <View
        {...other}
        ref={ref}
        importantForAccessibility='no-hide-descendants'
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? true}
      >
        {children}
      </View>
    );
  },
);

MeterTrack.displayName = 'Meter.Track';

export const MeterIndicator = React.forwardRef<View, MeterIndicatorProps>(
  (props, ref) => {
    const {
      style,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...other
    } = props;
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
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? true}
      />
    );
  },
);

MeterIndicator.displayName = 'Meter.Indicator';

export const MeterValue = React.forwardRef<Text, MeterValueProps>(
  (props, ref) => {
    const {
      children,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...other
    } = props;
    const { value, formattedValue } = useMeterContext();

    return (
      <Text
        {...other}
        ref={ref}
        importantForAccessibility='no-hide-descendants'
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? true}
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
