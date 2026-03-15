import * as React from 'react';
import {
  type NativeSyntheticEvent,
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  useKeyboardRange,
  type KeyPressEventData,
  resolveTabIndex,
  mergeRefs,
  DEFAULT_FOCUS_RING_STYLE,
} from '@base-ui-rn/core';
import { FocusRing, type FocusRingRenderProps } from '@base-ui-rn/focus-ring';
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
      onLayout,
      disableDefaultFocusRing = false,
      accessibilityRole = 'adjustable',
      accessibilityState,
      accessibilityHint,
      style,
      tabIndex,
      'aria-label': ariaLabel,
      getAriaLabel,
      getAriaValueText,
      ...props
    },
    ref,
  ) {
    const {
      state,
      setValueAtIndex,
      stepBy,
      largeStep,
      locale,
      format,
      setThumbSize,
      thumbAlignment,
    } = useSliderContext();
    const isDisabled = state.disabled || disabled;
    const valueNow = state.value[index] ?? state.min;
    const resolvedTabIndex = resolveTabIndex(!!isDisabled, tabIndex);
    const isWeb = Platform.OS === 'web';

    const innerRef = React.useRef<View>(null);
    const mergedRef = React.useMemo(() => mergeRefs(ref, innerRef), [ref]);

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

    return (
      <FocusRing>
        {({ focusVisible }: FocusRingRenderProps) => (
          <View
            {...props}
            ref={mergedRef}
            onLayout={handleLayout}
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
            // @ts-expect-error onKeyPress is valid on Web but missing in RN View types
            onKeyPress={handleKeyPress as never}
            tabIndex={isWeb ? -1 : resolvedTabIndex}
            aria-orientation={state.orientation}
            data-orientation={state.orientation}
            aria-valuemin={state.min}
            aria-valuemax={state.max}
            aria-valuenow={valueNow}
            aria-valuetext={resolvedAriaValueText}
            pointerEvents={isWeb ? 'none' : 'auto'}
            style={[
              dynamicStyle,
              typeof style === 'function'
                ? style({ ...state, index, valueNow, focusVisible })
                : style,
              !disableDefaultFocusRing &&
                focusVisible &&
                DEFAULT_FOCUS_RING_STYLE,
            ]}
          >
            {isWeb && (
              <input
                type='range'
                min={state.min}
                max={state.max}
                step={state.step}
                value={valueNow}
                disabled={isDisabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setValueAtIndex(
                    index,
                    parseFloat(e.target.value),
                    'input-change',
                  );
                }}
                tabIndex={resolvedTabIndex}
                aria-label={resolvedAriaLabel}
                aria-valuetext={resolvedAriaValueText}
                style={
                  {
                    ...StyleSheet.flatten(styles.input),
                    pointerEvents: 'auto',
                  } as React.CSSProperties
                }
              />
            )}
          </View>
        )}
      </FocusRing>
    );
  }),
);

const styles = StyleSheet.create({
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    // @ts-expect-error inherit is valid on Web but missing in RN types
    cursor: 'inherit',
    margin: 0,
    padding: 0,
  },
});

SliderThumb.displayName = 'Slider.Thumb';
