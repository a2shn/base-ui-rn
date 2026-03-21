import {
  evaluateStyles,
  type KeyPressEventData,
  mergeRefs,
  PressableWithKeyPress,
  resolveTabIndex,
  useKeyboardRange,
} from '@base-ui-rn/core';
import { useFocus } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import {
  type NativeSyntheticEvent,
  PanResponder,
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
  React.forwardRef<View, SliderThumbProps>(function SliderThumb(props, ref) {
    const {
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
      focusRingStyle,
      focusVisible: forceFocusVisible = false,
      getAriaLabel,
      getAriaValueText,
      index = 0,
      onBlur,
      onFocus,
      onKeyDown,
      onLayout,
      style,
      tabIndex,
    } = props;

    const {
      commitValue,
      format,
      largeStep,
      locale,
      setThumbSize,
      setValueAtIndex,
      state,
      stepBy,
      thumbAlignment,
      thumbRefs,
      trackSize,
    } = useSliderContext();
    const isDisabled = state.disabled || disabled;
    const valueNow = state.value[index] ?? state.min;
    const isWeb = Platform.OS === 'web';
    const resolvedTabIndex = resolveTabIndex(!!isDisabled, tabIndex ?? 0);
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

    const initialValue = React.useRef(0);
    const initialPointerPos = React.useRef(0);

    // --- WEB DRAGGING (Pointer API) ---
    React.useEffect(() => {
      if (!isWeb || isDisabled) return;

      const el = (innerRef.current as unknown as HTMLElement) ?? null;
      if (!el) return;

      const onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        const isHorizontal = state.orientation === 'horizontal';
        initialValue.current = state.value[index];
        initialPointerPos.current = isHorizontal ? e.clientX : e.clientY;
        el.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!el.hasPointerCapture(e.pointerId)) return;
        const isHorizontal = state.orientation === 'horizontal';
        const size = trackSize.current;
        if (size === 0) return;

        const currentPointerPos = isHorizontal ? e.clientX : e.clientY;
        const delta = currentPointerPos - initialPointerPos.current;
        const direction = isHorizontal ? 1 : -1;
        const range = state.max - state.min;
        const deltaValue = (delta / size) * range * direction;
        const newValue = initialValue.current + deltaValue;

        setValueAtIndex(index, newValue, 'drag');
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!el.hasPointerCapture(e.pointerId)) return;
        el.releasePointerCapture(e.pointerId);
        commitValue('drag');
      };

      el.addEventListener('pointerdown', onPointerDown);
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerUp);

      return () => {
        el.removeEventListener('pointerdown', onPointerDown);
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerup', onPointerUp);
        el.removeEventListener('pointercancel', onPointerUp);
      };
    }, [
      isWeb,
      isDisabled,
      index,
      state.orientation,
      state.value,
      state.max,
      state.min,
      setValueAtIndex,
      commitValue,
      trackSize,
    ]);

    // --- NATIVE DRAGGING (PanResponder) ---
    const panResponder = React.useMemo(() => {
      if (isWeb || isDisabled) return { panHandlers: {} };

      return PanResponder.create({
        onPanResponderGrant: () => {
          initialValue.current = state.value[index];
        },
        onPanResponderMove: (_, gestureState) => {
          const isHorizontal = state.orientation === 'horizontal';
          const size = trackSize.current;
          if (size === 0) return;

          const delta = isHorizontal ? gestureState.dx : -gestureState.dy;
          const range = state.max - state.min;
          const deltaValue = (delta / size) * range;
          const newValue = initialValue.current + deltaValue;

          setValueAtIndex(index, newValue, 'drag');
        },
        onPanResponderRelease: () => {
          commitValue('drag');
        },
        onPanResponderTerminate: () => {
          commitValue('drag');
        },
        onStartShouldSetPanResponder: () => true,
      });
    }, [
      isWeb,
      isDisabled,
      index,
      state.orientation,
      state.value,
      state.max,
      state.min,
      trackSize,
      setValueAtIndex,
      commitValue,
    ]);

    const handleKeyboardRange = useKeyboardRange({
      disabled: isDisabled,
      onDecrement: () => stepBy(index, -1),
      onEnd: () => stepBy(index, 100000), // Max
      onHome: () => stepBy(index, -100000), // Min
      onIncrement: () => stepBy(index, 1),
      onPageDown: () => stepBy(index, -largeStep),
      onPageUp: () => stepBy(index, largeStep),
      orientation: state.orientation,
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
      : { max: state.max, min: state.min, now: valueNow };

    const {
      focusVisible,
      onBlur: handleBlur,
      onFocus: handleFocus,
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
        {...panResponder.panHandlers}
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
        pointerEvents={pointerEvents}
        ref={mergedRef}
        role={accessibilityRole as never}
        style={[
          dynamicStyle,
          evaluateStyles(
            style,
            { ...state, focusVisible, index, valueNow },
            { disableDefaultFocusRing, focusRingStyle },
          ),
        ]}
        tabIndex={resolvedTabIndex}
      />
    );
  }),
);

SliderThumb.displayName = 'Slider.Thumb';
