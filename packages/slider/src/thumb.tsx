import * as React from 'react';
import {
  Pressable,
  type View,
  type ViewStyle,
  type StyleProp,
  type NativeSyntheticEvent,
  type TargetedEvent,
  type PressableProps,
} from 'react-native';
import type { SliderThumbProps, KeyPressEventData } from './types';
import { useSliderContext } from './context';

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps & {
      onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
    } & React.RefAttributes<View>
  >;

/**
 * The draggable handle of the Slider.
 *
 * @example
 * ```tsx
 * <Slider.Thumb />
 * ```
 */
export const SliderThumb = React.forwardRef<View, SliderThumbProps>(
  (props, ref) => {
    const {
      children,
      style,
      index = 0,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-valuemin': ariaValueMin,
      'aria-valuemax': ariaValueMax,
      'aria-valuenow': ariaValueNow,
      'aria-valuetext': ariaValueText,
      ...otherViewProps
    } = props;

    const context = useSliderContext();
    const value = context.values[index];
    const percentage = context.percentages[index];

    const thumbStyle = React.useMemo<ViewStyle>(() => {
      const isHorizontal = context.orientation === 'horizontal';
      const isEdge = context.thumbAlignment === 'edge';

      if (isHorizontal) {
        if (isEdge && context.thumbSize > 0) {
          // For 'edge' alignment, we already calculated the value correctly in useSliderRoot.
          // We just need to place it.
          return {
            position: 'absolute',
            left: `${percentage}%`,
            marginLeft: -(percentage / 100) * context.thumbSize,
          };
        }
        return {
          position: 'absolute',
          left: `${percentage}%`,
          transform: [{ translateX: -context.thumbSize / 2 || 0 }],
        };
      }

      if (isEdge && context.thumbSize > 0) {
        return {
          position: 'absolute',
          bottom: `${percentage}%`,
          marginBottom: -(percentage / 100) * context.thumbSize,
        };
      }
      return {
        position: 'absolute',
        bottom: `${percentage}%`,
        transform: [{ translateY: context.thumbSize / 2 || 0 }],
      };
    }, [
      percentage,
      context.orientation,
      context.thumbAlignment,
      context.thumbSize,
      context.min,
      context.max,
    ]);

    const handleFocus = React.useCallback(
      (e: NativeSyntheticEvent<TargetedEvent>) => {
        context.onThumbFocus(index);
        onFocusProp?.(e);
      },
      [context, index, onFocusProp],
    );

    const handleBlur = React.useCallback(
      (e: NativeSyntheticEvent<TargetedEvent>) => {
        context.onThumbBlur();
        onBlurProp?.(e);
      },
      [context, onBlurProp],
    );

    const stateWithIndex = React.useMemo(
      () => ({
        ...context,
        index,
      }),
      [context, index],
    );

    const resolvedChildren =
      typeof children === 'function' ? children(stateWithIndex) : children;

    const handleKeyDown = React.useCallback(
      (e: NativeSyntheticEvent<KeyPressEventData>) => {
        context.handleKeyDown(index, e);
      },
      [context, index],
    );

    return (
      <PressableWithKeyPress
        {...otherViewProps}
        ref={ref}
        style={[thumbStyle, style as StyleProp<ViewStyle>]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyPress={handleKeyDown}
        onLayout={context.onThumbLayout}
        disabled={context.disabled}
        tabIndex={0}
        accessible
        role='slider'
        accessibilityLabel={ariaLabel}
        accessibilityHint='Adjusts the slider value'
        accessibilityState={{
          disabled: context.disabled,
        }}
        aria-valuemin={ariaValueMin ?? context.min}
        aria-valuemax={ariaValueMax ?? context.max}
        aria-valuenow={ariaValueNow ?? value}
        aria-valuetext={ariaValueText}
        aria-labelledby={ariaLabelledBy ?? context.labelId}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        data-dragging={context.draggingIndex === index ? 'true' : undefined}
        data-orientation={context.orientation}
        data-disabled={context.disabled ? 'true' : undefined}
        data-focused={context.focusedIndex === index ? 'true' : undefined}
        data-index={index}
      >
        {resolvedChildren}
      </PressableWithKeyPress>
    );
  },
);

SliderThumb.displayName = 'Slider.Thumb';
