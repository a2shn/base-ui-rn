import {
  evaluateStyles,
  type KeyPressEventData,
  mergeRefs,
  PressableWithKeyPress,
  useKeyboard,
} from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import {
  findNodeHandle,
  type NativeSyntheticEvent,
  Platform,
  type TargetedEvent,
  View,
} from 'react-native';

import { useSliderContext } from './context';
import type { SliderThumbProps } from './types';

/**
 * Draggable handle that controls a slider value.
 */
export const SliderThumb = React.memo(
  React.forwardRef<View, SliderThumbProps>(function SliderThumb(
    {
      accessibilityHint,
      accessibilityRole = 'adjustable',
      accessibilityState,
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      disabled,
      disableDefaultFocusRing = false,
      focusableWhenDisabled = false,
      getAriaLabel,
      getAriaValueText,
      index = 0,
      onBlur,
      onFocus,
      onKeyDown,
      onLayout,
      onPress,
      style,
      tabIndex: tabIndexProp,
      ...props
    },
    ref,
  ) {
    const {
      focusedThumbIndex,
      focusThumb,
      format,
      formatter,
      largeStep,
      locale,
      setFocusedThumbIndex,
      setThumbSize,
      state,
      stepBy,
      thumbAlignment,
      thumbNodeHandles,
      thumbRefs,
    } = useSliderContext();
    const isDisabled = state.disabled || disabled;
    const isDisabledBoolean = Boolean(isDisabled);
    const valueNow = state.value[index] ?? state.min;
    const isWeb = Platform.OS === 'web';

    const innerRef = React.useRef<View>(null);
    const mergedRef = React.useMemo(() => mergeRefs(ref, innerRef), [ref]);

    const {
      focused,
      focusRingStyle,
      isFocusable,
      onBlur: handleBlur,
      onFocus: handleFocus,
    } = useFocusRing({
      disabled: isDisabledBoolean,
      disableDefaultFocusRing,
      focusableWhenDisabled: focusableWhenDisabled ?? false,
    });

    const tabIndex = resolveTabIndex(
      isFocusable,
      tabIndexProp as 0 | -1 | undefined,
    );

    // Register thumb ref with control for PanResponder coordination
    React.useEffect(() => {
      const refs = thumbRefs.current;
      refs[index] = innerRef.current;

      if (!isWeb && innerRef.current) {
        const nodeHandle = findNodeHandle(innerRef.current);
        if (typeof nodeHandle === 'number') {
          thumbNodeHandles.current[index] = nodeHandle;
        }
      }

      return () => {
        refs[index] = null;
        thumbNodeHandles.current[index] = undefined;
      };
    }, [index, thumbRefs, thumbNodeHandles, isWeb]);

    const handleLayout = React.useCallback(
      (event: import('react-native').LayoutChangeEvent) => {
        const { height, width } = event.nativeEvent.layout;
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

    const onDecrement = React.useCallback(
      () => stepBy(index, -1),
      [index, stepBy],
    );
    const onEnd = React.useCallback(
      () => stepBy(index, 100000),
      [index, stepBy],
    );
    const onHome = React.useCallback(
      () => stepBy(index, -100000),
      [index, stepBy],
    );
    const onIncrement = React.useCallback(
      () => stepBy(index, 1),
      [index, stepBy],
    );
    const onPageDown = React.useCallback(
      () => stepBy(index, -largeStep),
      [index, largeStep, stepBy],
    );
    const onPageUp = React.useCallback(
      () => stepBy(index, largeStep),
      [index, largeStep, stepBy],
    );

    const handleKeyboardRange = useKeyboard({
      disabled: isDisabled,
      onArrowDown: onDecrement,
      onArrowLeft: onDecrement,
      onArrowRight: onIncrement,
      onArrowUp: onIncrement,
      onEnd,
      onHome,
      onPageDown,
      onPageUp,
    });

    const handleKeyDown = React.useCallback(
      (event: NativeSyntheticEvent<KeyPressEventData>) => {
        handleKeyboardRange(event);
        onKeyDown?.(event);
      },
      [handleKeyboardRange, onKeyDown],
    );

    const range = state.max - state.min || 1;
    const percent = ((valueNow - state.min) / range) * 100;

    const dynamicStyle = React.useMemo((): import('react-native').ViewStyle => {
      const isHorizontal = state.orientation === 'horizontal';
      const isEdge = thumbAlignment === 'edge';

      if (isHorizontal) {
        return {
          left: `${percent}%` as never,
          position: 'absolute',
          transform: [
            { translateX: isEdge ? `${-percent}%` : '-50%' } as never,
          ],
        };
      } else {
        return {
          bottom: `${percent}%` as never,
          position: 'absolute',
          transform: [{ translateY: isEdge ? `${percent}%` : '50%' } as never],
        };
      }
    }, [state.orientation, percent, thumbAlignment]);

    const formattedValue = React.useMemo(() => {
      return formatter ? formatter.format(valueNow) : valueNow.toString();
    }, [formatter, valueNow]);

    const resolvedAriaLabel = React.useMemo(
      () => (getAriaLabel ? getAriaLabel(index) : ariaLabel),
      [getAriaLabel, index, ariaLabel],
    );

    const resolvedAriaValueText = React.useMemo(
      () =>
        getAriaValueText
          ? getAriaValueText(formattedValue, valueNow, index)
          : formattedValue,
      [getAriaValueText, formattedValue, valueNow, index],
    );

    const hasCustomText = getAriaValueText || format || locale;
    const a11yValue = React.useMemo(
      () =>
        hasCustomText
          ? { text: resolvedAriaValueText }
          : { max: state.max, min: state.min, now: valueNow },
      [hasCustomText, resolvedAriaValueText, state.max, state.min, valueNow],
    );

    const handleFocusCallback = React.useCallback(
      (e: NativeSyntheticEvent<TargetedEvent>) => {
        handleFocus();
        focusThumb(index);
        onFocus?.(e);
      },
      [handleFocus, focusThumb, index, onFocus],
    );

    const handleBlurCallback = React.useCallback(
      (e: NativeSyntheticEvent<TargetedEvent>) => {
        handleBlur();
        setFocusedThumbIndex(null);
        onBlur?.(e);
      },
      [handleBlur, onBlur, setFocusedThumbIndex],
    );

    const handlePress = React.useCallback(
      (e: import('react-native').GestureResponderEvent) => {
        focusThumb(index);
        onPress?.(e);
      },
      [focusThumb, index, onPress],
    );

    const thumbState = React.useMemo(
      () => ({ ...state, focused, index, valueNow }),
      [state, focused, index, valueNow],
    );

    const webStyle = React.useMemo(() => {
      if (Platform.OS !== 'web') return {};
      return { touchAction: 'none' } as import('react-native').ViewStyle;
    }, []);

    return (
      <PressableWithKeyPress
        {...props}
        accessibilityActions={[
          { label: 'increment', name: 'increment' },
          { label: 'decrement', name: 'decrement' },
        ]}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={resolvedAriaLabel}
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled: isDisabled, ...accessibilityState }}
        accessibilityValue={a11yValue}
        accessible
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-label={resolvedAriaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-orientation={state.orientation}
        aria-valuemax={state.max}
        aria-valuemin={state.min}
        aria-valuenow={valueNow}
        aria-valuetext={resolvedAriaValueText}
        data-disabled={isDisabled}
        data-dragging={state.dragging}
        data-focused={focusedThumbIndex === index}
        data-index={index}
        data-orientation={state.orientation}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'increment') {
            stepBy(index, 1);
          } else if (event.nativeEvent.actionName === 'decrement') {
            stepBy(index, -1);
          }
        }}
        onBlur={handleBlurCallback}
        onFocus={handleFocusCallback}
        onKeyDown={handleKeyDown}
        onLayout={handleLayout}
        onPress={handlePress}
        ref={mergedRef}
        role={accessibilityRole as never}
        style={[
          dynamicStyle,
          evaluateStyles(style, thumbState),
          focusRingStyle,
          webStyle,
        ]}
        tabIndex={tabIndex}
      />
    );
  }),
);

SliderThumb.displayName = 'Slider.Thumb';
