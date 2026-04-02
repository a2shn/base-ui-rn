import {
  evaluateStyles,
  PressableWithKeyDown,
  mergeProps, // Use the "Protected" version we built
  mergeRefs,
  useStyle,
} from '@base-ui-rn/core';
import * as React from 'react';
import { type PressableStateCallbackType, View } from 'react-native';
import type { ButtonProps, ButtonState } from './types';
import { useButton } from './use-button';

export const Button = React.memo(
  React.forwardRef<View, ButtonProps>(function Button(props, forwardedRef) {
    // 1. Extract onPress so mergeProps doesn't chain it automatically
    const { children, style, onPress, ...otherProps } = props;

    const internalRef = React.useRef<View>(null);
    const mergedRef = mergeRefs(internalRef, forwardedRef);

    const {
      focused,
      focusVisible,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      handlePressIn,
      handlePressOut,
      handleAccessibilityAction,
      isDisabled,
      isFocusable,
      pressed,
      tabIndex,
    } = useButton(props);

    const buttonState: ButtonState = React.useMemo(
      () => ({ disabled: isDisabled, focused, focusVisible, pressed }),
      [focused, focusVisible, isDisabled, pressed],
    );

    const resolvedStyle = useStyle({
      additionalStyles: focusRingStyle,
      state: buttonState,
      style,
    });

    // We pass handlePress here. Because we omitted onPress from 'otherProps',
    // handlePress is now the SOLE authority for firing the action.
    const mergedProps = mergeProps(otherProps, {
      handlers: {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onPress: handlePress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        onAccessibilityAction: handleAccessibilityAction,
      },
      disabled: isDisabled,
      focusable: isFocusable,
      ref: mergedRef,
      style: resolvedStyle,
      accessibilityState: { disabled: isDisabled, selected: pressed },
      accessibilityActions: !isDisabled ? [{ name: 'activate' }] : [],
    });

    return (
      <PressableWithKeyDown
        accessibilityHint="Activates the button"
        accessible={true}
        importantForAccessibility={isFocusable ? 'yes' : 'no'}
        role="button"
        tabIndex={tabIndex}
        {...mergedProps}
      >
        {(pressableState: PressableStateCallbackType) =>
          evaluateStyles(children, { ...pressableState, ...buttonState })
        }
      </PressableWithKeyDown>
    );
  }),
);
