import {
  mergeProps,
  PressableWithKeyDown,
  resolveValue,
} from '@base-ui-rn/core';
import * as React from 'react';
import { type PressableStateCallbackType, View } from 'react-native';

import { ButtonProps } from './types';
import { useButton } from './use-button';

/**
 * Headless button primitive built on top of React Native Pressable.
 *
 * A native button component with support for keyboard interaction, focus
 * management, and accessibility states.
 *
 * @example
 * ```tsx
 * <Button onPress={() => console.log('pressed')}>
 * <Text>Click me</Text>
 * </Button>
 * ```
 */
export const Button = React.memo(
  React.forwardRef<View, ButtonProps>(function Button(props, ref) {
    const { children, style, ...otherProps } = props;

    const internalRef = React.useRef<View>(null);

    const {
      focused,
      focusRingStyle,
      focusVisible,
      handleBlur,
      handleFocus,
      handlePressIn,
      handlePressOut,
      isDisabled,
      isFocusable,
      pressed,
      tabIndex,
    } = useButton(props);

    const buttonState = React.useMemo(
      () => ({ disabled: isDisabled, focused, focusVisible, pressed }),
      [focused, focusVisible, isDisabled, pressed],
    );

    const resolvedStyle = resolveValue(style, buttonState);

    const mergedProps = mergeProps(
      {
        accessibilityActions: !isDisabled ? [{ name: 'activate' }] : [],
        accessibilityState: { disabled: isDisabled, selected: pressed },
        onBlur: handleBlur,
        onFocus: handleFocus,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        ref: internalRef,
        style: [resolvedStyle, focusRingStyle],
      },
      { ref },
      otherProps,
      {
        accessibilityHint: 'Activates the button',
        accessible: true,
        role: 'button',
      },
    );

    return (
      <PressableWithKeyDown
        {...mergedProps}
        disabled={isDisabled}
        focusable={isFocusable}
        importantForAccessibility={isFocusable ? 'yes' : 'no'}
        style={[resolvedStyle, focusRingStyle]}
        tabIndex={tabIndex}
      >
        {(pressableState: PressableStateCallbackType) =>
          resolveValue(children, { ...pressableState, ...buttonState })
        }
      </PressableWithKeyDown>
    );
  }),
);
