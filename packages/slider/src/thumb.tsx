import * as React from 'react';
import { type NativeSyntheticEvent, View } from 'react-native';
import { useKeyboardRange, type KeyPressEventData } from '@base-ui-rn/core';
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
      onKeyPress,
      onLayout,
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
    const { state, stepBy, largeStep, locale, format, setThumbSize } =
      useSliderContext();
    const isDisabled = state.disabled || disabled;
    const valueNow = state.value[index] ?? state.min;

    const handleLayout = React.useCallback(
      (event: import('react-native').LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setThumbSize(state.orientation === 'horizontal' ? width : height);
        onLayout?.(event);
      },
      [setThumbSize, state.orientation, onLayout],
    );

    const handleKeyboardRange = useKeyboardRange({
      onIncrement: () => stepBy(index, 1),
      onDecrement: () => stepBy(index, -1),
      onPageUp: () => stepBy(index, largeStep),
      onPageDown: () => stepBy(index, -largeStep),
      onHome: () => stepBy(index, -100000), // Min
      onEnd: () => stepBy(index, 100000), // Max
      disabled: isDisabled,
      orientation: state.orientation,
    });

    const handleKeyPress = React.useCallback(
      (event: NativeSyntheticEvent<KeyPressEventData>) => {
        handleKeyboardRange(event);
        onKeyPress?.(event);
      },
      [handleKeyboardRange, onKeyPress],
    );

    const range = state.max - state.min || 1;
    const percent = ((valueNow - state.min) / range) * 100;
    const { thumbAlignment } = useSliderContext();

    const dynamicStyle = React.useMemo((): import('react-native').ViewStyle => {
      const isHorizontal = state.orientation === 'horizontal';
      const isEdge = thumbAlignment === 'edge';

      if (isHorizontal) {
        return {
          position: 'absolute',
          left: `${percent}%` as never,
          transform: [
            { translateX: isEdge ? `${-percent}%` : '-50%' } as never,
          ],
        };
      } else {
        return {
          position: 'absolute',
          bottom: `${percent}%` as never,
          transform: [{ translateY: isEdge ? `${percent}%` : '50%' } as never],
        };
      }
    }, [state.orientation, percent, thumbAlignment]);

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
        onLayout={handleLayout}
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
