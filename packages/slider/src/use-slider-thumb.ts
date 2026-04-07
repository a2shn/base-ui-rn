import { KeyDownEventData, useFormatter, useKeyboard } from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import {
  findNodeHandle,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Platform,
  type View,
} from 'react-native';

import { useSliderContext } from './context';
import type { SliderThumbProps } from './types';

export function useSliderThumb(props: SliderThumbProps) {
  const {
    disabled,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    index = 0,
    onBlur,
    onFocus,
    onKeyDown,
    onLayout,
    onPress,
    tabIndex: tabIndexProp,
    getAccessibilityValueText
  } = props;



  const {
    focusedThumbIndex,
    focusThumb,
    largeStep,
    setFocusedThumbIndex,
    setThumbSize,
    state,
    stepBy,
    thumbNodeHandles,
    thumbRefs,
    format,
    locale,
    thumbAlignment
  } = useSliderContext();


  const isDisabled = Boolean(state.disabled || disabled);
  const valueNow = state.value[index] ?? state.min;
  const isWeb = Platform.OS === 'web';

  const internalRef = React.useRef<View>(null);

  const {
    focused,
    focusRingStyle,
    isFocusable,
    onBlur: onRingBlur,
    onFocus: onRingFocus,
    focusVisible,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp);

  React.useEffect(() => {
    const refs = thumbRefs.current;
    if (refs) refs[index] = internalRef.current;

    if (!isWeb && internalRef.current && thumbNodeHandles.current) {
      const nodeHandle = findNodeHandle(internalRef.current);
      if (typeof nodeHandle === 'number') {
        thumbNodeHandles.current[index] = nodeHandle;
      }
    }

    return () => {
      if (refs) refs[index] = null;
      if (thumbNodeHandles.current) thumbNodeHandles.current[index] = undefined;
    };
  }, [index, thumbRefs, thumbNodeHandles, isWeb]);

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;
      setThumbSize(state.orientation === 'horizontal' ? width : height);

      if (!isWeb && internalRef.current) {
        (internalRef.current as unknown as View).measureInWindow(
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
    const el = (internalRef.current as unknown as HTMLElement) ?? null;
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
  const onEnd = React.useCallback(() => stepBy(index, 100000), [index, stepBy]);
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
    (event: NativeSyntheticEvent<KeyDownEventData>) => {
      handleKeyboardRange(event);
    },
    [handleKeyboardRange, onKeyDown],
  );

  const handleFocus = React.useCallback(() => {
    onRingFocus();
    focusThumb(index);
  }, [onRingFocus, focusThumb, index, onFocus]);

  const handleBlur = React.useCallback(() => {
    onRingBlur();
    setFocusedThumbIndex(null);
  }, [onRingBlur, onBlur, setFocusedThumbIndex]);

  const handlePress = React.useCallback(() => {
    focusThumb(index);
  }, [focusThumb, index, onPress]);

  const handleAccessibilityAction = React.useCallback(
    (event: { nativeEvent?: { actionName?: string } }) => {
      const actionName = event.nativeEvent?.actionName;
      if (actionName === 'increment') {
        stepBy(index, 1);
      } else if (actionName === 'decrement') {
        stepBy(index, -1);
      }
    },
    [isDisabled, index, stepBy],
  );


  const { formattedValues } = useFormatter([valueNow], {
    formatOptions: format,
    locale: locale,
  });

  const formattedValue = formattedValues[0] ?? valueNow.toString();

  const resolvedAriaValueText = React.useMemo(
    () =>
      getAccessibilityValueText
        ? getAccessibilityValueText(formattedValue, valueNow, index)
        : formattedValue,
    [getAccessibilityValueText, formattedValue, valueNow, index],
  );

  const hasCustomText = getAccessibilityValueText || format || locale;
  const accessibilityValue = React.useMemo(
    () =>
      hasCustomText
        ? { text: resolvedAriaValueText }
        : { max: state.max, min: state.min, now: valueNow },
    [hasCustomText, resolvedAriaValueText, state.max, state.min, valueNow],
  );

  const thumbState = React.useMemo(
    () => ({ ...state, focusVisible, focused, index, valueNow }),
    [state, focusVisible, focused, index, valueNow],
  )


  return {
    focusRingStyle,
    focusVisible,
    focused,
    focusedThumbIndex,
    handleAccessibilityAction,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handleLayout,
    handlePress,
    internalRef,
    isDisabled,
    state: thumbState,
    tabIndex,
    valueNow,
    thumbAlignment,
    accessibilityValue
  };
}
