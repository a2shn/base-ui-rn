import {
  evaluateStyles,
  mergeProps,
  PressableWithKeyDown,
  useStyle,
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
 *   <Text>Click me</Text>
 * </Button>
 * ```
 */
export const Button = React.memo(
  React.forwardRef<View, ButtonProps>(function Button(props, ref) {
    const { children, style } = props;

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

    const resolvedStyle = useStyle({
      additionalStyles: focusRingStyle,
      state: buttonState,
      style,
    });

    const mergedProps = mergeProps(props, {
      accessibilityActions: !isDisabled ? [{ name: 'activate' }] : [],
      accessibilityState: { disabled: isDisabled, selected: pressed },
      onBlur: handleBlur,
      onFocus: handleFocus,
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      ref: [internalRef, ref],
      style: resolvedStyle,
    });

    return (
      <PressableWithKeyDown
        accessibilityHint='Activates the button'
        accessible={true}
        importantForAccessibility={isFocusable ? 'yes' : 'no'}
        role='button'
        {...mergedProps}
        disabled={isDisabled}
        focusable={isFocusable}
        tabIndex={tabIndex}
      >
        {(pressableState: PressableStateCallbackType) =>
          evaluateStyles(children, { ...pressableState, ...buttonState })
        }
      </PressableWithKeyDown>
    );
  }),
);
