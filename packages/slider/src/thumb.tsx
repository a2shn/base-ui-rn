import * as React from 'react';
import {
  Platform,
  View,
  type NativeSyntheticEvent,
  type TargetedEvent,
} from 'react-native';
import {
  useKeyboardRange,
  resolveTabIndex,
  mergeRefs,
  evaluateStyles,
  PressableWithKeyPress,
  type KeyPressEventData,
} from '@base-ui-rn/core';
import { useFocus } from '@base-ui-rn/focus-ring';
import { useSliderContext } from './context';
import type { SliderThumbProps } from './types';

/**
 * Draggable handle that controls a slider value.
 */
export const SliderThumb = React.memo(
  React.forwardRef<View, SliderThumbProps>(function SliderThumb(
    {
      index = 0,
      disabled,
      onKeyPress,
      onFocus,
      onBlur,
      onLayout,
      disableDefaultFocusRing = false,
      focusRingStyle,
      focusVisible: forceFocusVisible = false,
      accessibilityRole = 'adjustable',
      accessibilityState,
      accessibilityHint,
      style,
      tabIndex,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      getAriaLabel,
      getAriaValueText,
      ...props
    },
    ref,
  ) {
    const {
      state,
      stepBy,
      largeStep,
      locale,
      format,
      setThumbSize,
      thumbAlignment,
      thumbRefs,
    } = useSliderContext();
    const isDisabled = state.disabled || disabled;
    const valueNow = state.value[index] ?? state.min;
    const isWeb = Platform.OS === 'web';
    const resolvedTabIndex = resolveTabIndex(!!isDisabled, tabIndex);
    const pointerEvents = 'auto' as const;

    const innerRef = React.useRef<View>(null);
    const mergedRef = React.useMemo(() => mergeRefs(ref, innerRef), [ref]);

    // Register thumb ref with control for PanResponder coordination
    React.useEffect(() => {
      const refs = thumbRefs.current;
      refs[index] = innerRef.current;
      return () => {
        refs[index] = null;
      };
    }, [index, thumbRefs]);

    const handleLayout = React.useCallback(
      (event: import('react-native').LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setThumbSize(state.orientation === 'horizontal' ? width : height);

        if (!isWeb) {
          (innerRef.current as unknown as View).measureInWindow(
            (_x, _y, w, h) => {
              setThumbSize(state.orientation === 'horizontal' ? w : h);
            },
          );
        }

        onLayout?.(event);
      },
      [setThumbSize, state.orientation, onLayout, isWeb],
    );

    React.useEffect(() => {
      if (!isWeb) return;
      const el = (innerRef.current as unknown as HTMLElement) ?? null;
      if (el?.getBoundingClientRect) {
        const rect = el.getBoundingClientRect();
        setThumbSize(
          state.orientation === 'horizontal' ? rect.width : rect.height,
        );
      }
    }, [isWeb, state.orientation, setThumbSize]);

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

    const handleKeyDown = React.useCallback(
      (event: NativeSyntheticEvent<KeyPressEventData>) => {
        handleKeyboardRange(event);
        onKeyPress?.(event);
      },
      [handleKeyboardRange, onKeyPress],
    );

    const range = state.max - state.min || 1;
    const percent = ((valueNow - state.min) / range) * 100;

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

    const formatter = React.useMemo(() => {
      try {
        return new Intl.NumberFormat(locale, format);
      } catch {
        return null;
      }
    }, [locale, format]);

    const formattedValue = React.useMemo(() => {
      return formatter ? formatter.format(valueNow) : valueNow.toString();
    }, [formatter, valueNow]);

    const resolvedAriaLabel = getAriaLabel ? getAriaLabel(index) : ariaLabel;
    const resolvedAriaValueText = getAriaValueText
      ? getAriaValueText(formattedValue, valueNow, index)
      : formattedValue;

    const hasCustomText = getAriaValueText || format || locale;
    const a11yValue = hasCustomText
      ? { text: resolvedAriaValueText }
      : { min: state.min, max: state.max, now: valueNow };

    const {
      focusVisible,
      onFocus: handleFocus,
      onBlur: handleBlur,
    } = useFocus({
      focusVisible: forceFocusVisible,
    });

    const handleFocusCallback = React.useCallback(
      (e: NativeSyntheticEvent<TargetedEvent>) => {
        handleFocus();
        onFocus?.(e);
      },
      [handleFocus, onFocus],
    );

    const handleBlurCallback = React.useCallback(
      (e: NativeSyntheticEvent<TargetedEvent>) => {
        handleBlur();
        onBlur?.(e);
      },
      [handleBlur, onBlur],
    );

    return (
      <PressableWithKeyPress
        {...props}
        ref={mergedRef}
        onLayout={handleLayout}
        onFocus={handleFocusCallback}
        onBlur={handleBlurCallback}
        accessible
        role={accessibilityRole as never}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={resolvedAriaLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, ...accessibilityState }}
        accessibilityValue={a11yValue}
        accessibilityActions={[
          { name: 'increment', label: 'increment' },
          { name: 'decrement', label: 'decrement' },
        ]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'increment') {
            stepBy(index, 1);
          } else if (event.nativeEvent.actionName === 'decrement') {
            stepBy(index, -1);
          }
        }}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
        tabIndex={resolvedTabIndex}
        aria-label={resolvedAriaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-orientation={state.orientation}
        data-orientation={state.orientation}
        data-disabled={isDisabled}
        aria-valuemin={state.min}
        aria-valuemax={state.max}
        aria-valuenow={valueNow}
        aria-valuetext={resolvedAriaValueText}
        pointerEvents={pointerEvents}
        style={[
          dynamicStyle,
          evaluateStyles(
            style,
            { ...state, index, valueNow, focusVisible },
            { disableDefaultFocusRing, focusRingStyle },
          ),
        ]}
      />
    );
  }),
);

SliderThumb.displayName = 'Slider.Thumb';
