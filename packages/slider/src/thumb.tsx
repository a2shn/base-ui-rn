import * as React from 'react';
import {
  Pressable,
  type PressableProps,
  type NativeSyntheticEvent,
  type View,
} from 'react-native';
import {
  useKeyboardActivation,
  type KeyPressEventData,
} from '@base-ui-rn/core';
import { useSliderContext } from './context';
import type { SliderThumbProps } from './types';

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps & {
      onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
    } & React.RefAttributes<View>
  >;

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
      ...props
    },
    ref,
  ) {
    const { state, stepBy } = useSliderContext();
    const isDisabled = state.disabled || disabled;
    const valueNow = state.value[index] ?? state.min;

    const activateIncrease = useKeyboardActivation(
      () => stepBy(index, 1),
      isDisabled,
    );

    const handleKeyPress = React.useCallback(
      (event: NativeSyntheticEvent<KeyPressEventData>) => {
        const key = event.nativeEvent.key;
        if (key === 'ArrowLeft' || key === 'ArrowDown') {
          event.preventDefault?.();
          if (!isDisabled) {
            stepBy(index, -1);
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
      [activateIncrease, index, isDisabled, onKeyPress, stepBy],
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

    return (
      <PressableWithKeyPress
        {...props}
        ref={ref}
        accessible
        role={accessibilityRole as never}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={ariaLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, ...accessibilityState }}
        onPress={onPress}
        onKeyPress={handleKeyPress}
        aria-valuemin={state.min}
        aria-valuemax={state.max}
        aria-valuenow={valueNow}
        accessibilityValue={{ min: state.min, max: state.max, now: valueNow }}
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
