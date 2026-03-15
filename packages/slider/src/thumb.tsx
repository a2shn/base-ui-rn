import * as React from 'react';
import { type NativeSyntheticEvent, View } from 'react-native';
import {
  useKeyboardActivation,
  type KeyPressEventData,
} from '@base-ui-rn/core';
import { useSliderContext } from './context';
import type { SliderThumbProps } from './types';

/**
 * Draggable handle that controls a slider value.
 *
 * Supports keyboard adjustment and exposes adjustable semantics for screen
 * readers and web assistive technologies.
 *
 * @example
 * ```tsx
 * <Slider.Track>
 *   <Slider.Thumb aria-label='Volume' />
 * </Slider.Track>
 * ```
 */
export const SliderThumb = React.memo(
  React.forwardRef<View, SliderThumbProps>(function SliderThumb(
    {
      index = 0,
      disabled,
      onPress,
      onKeyPress,
      accessibilityRole = 'adjustable',
      accessibilityState,
      accessibilityHint,
      style,
      'aria-label': ariaLabel,
      getAriaLabel,
      getAriaValueText,
      ...props
    },
    ref,
  ) {
    const { state, stepBy, largeStep, locale, format } = useSliderContext();
    const isDisabled = state.disabled || disabled;
    const valueNow = state.value[index] ?? state.min;

    const activateIncrease = useKeyboardActivation(
      () => stepBy(index, 1),
      isDisabled,
    );

    const handleKeyPress = React.useCallback(
      (event: NativeSyntheticEvent<KeyPressEventData>) => {
        const key = event.nativeEvent.key;
        // React Native KeyPressEventData does not have shiftKey

        if (key === 'ArrowLeft' || key === 'ArrowDown') {
          event.preventDefault?.();
          if (!isDisabled) {
            stepBy(index, -1);
          }
          return;
        }
        if (key === 'ArrowRight' || key === 'ArrowUp') {
          // Native handles normal increase via activateIncrease
        }
        if (key === 'PageUp') {
          event.preventDefault?.();
          if (!isDisabled) {
            stepBy(index, largeStep);
          }
          return;
        }
        if (key === 'PageDown') {
          event.preventDefault?.();
          if (!isDisabled) {
            stepBy(index, -largeStep);
          }
          return;
        }
        if (key === 'Home') {
          event.preventDefault?.();
          if (!isDisabled) {
            stepBy(index, -100000);
          }
          return;
        }
        if (key === 'End') {
          event.preventDefault?.();
          if (!isDisabled) {
            stepBy(index, 100000);
          }
          return;
        }

        activateIncrease(event);
        onKeyPress?.(event);
      },
      [activateIncrease, index, isDisabled, onKeyPress, stepBy, largeStep],
    );

    const range = state.max - state.min || 1;
    const percent = ((valueNow - state.min) / range) * 100;

    const dynamicStyle: import('react-native').ViewStyle =
      state.orientation === 'horizontal'
        ? {
            position: 'absolute',
            left: `${percent}%` as never,
            transform: [{ translateX: '-50%' } as never],
          }
        : {
            position: 'absolute',
            bottom: `${percent}%` as never,
            transform: [{ translateY: '50%' } as never],
          };

    const formattedValue = React.useMemo(() => {
      if (format || locale) {
        return new Intl.NumberFormat(locale, format).format(valueNow);
      }
      return valueNow.toString();
    }, [valueNow, format, locale]);

    const resolvedAriaLabel = getAriaLabel ? getAriaLabel(index) : ariaLabel;
    const resolvedAriaValueText = getAriaValueText
      ? getAriaValueText(formattedValue, valueNow, index)
      : formattedValue;

    const hasCustomText = getAriaValueText || format || locale;
    const a11yValue = hasCustomText
      ? { text: resolvedAriaValueText }
      : { min: state.min, max: state.max, now: valueNow };

    return (
      <View
        {...props}
        ref={ref}
        accessible
        role={accessibilityRole as never}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={resolvedAriaLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, ...accessibilityState }}
        accessibilityValue={a11yValue}
        // @ts-expect-error onKeyPress is valid on Web but missing in RN View types
        onKeyPress={handleKeyPress as never}
        aria-valuemin={state.min}
        aria-valuemax={state.max}
        aria-valuenow={valueNow}
        aria-valuetext={resolvedAriaValueText}
        style={[
          dynamicStyle,
          typeof style === 'function'
            ? style({ ...state, index, valueNow })
            : style,
        ]}
      />
    );
  }),
);

SliderThumb.displayName = 'Slider.Thumb';
