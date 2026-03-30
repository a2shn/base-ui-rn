import {
  DEFAULT_HIT_SLOP,
  evaluateStyles,
  PressableWithKeyDown,
} from '@base-ui-rn/core';
import * as React from 'react';
import {
  type PressableStateCallbackType,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import type { ButtonProps, ButtonState } from './types';
import { useButton } from './use-button';
import { eventNames } from 'process';

/**
 * Headless button primitive built on top of React Native Pressable.
 *
 * Supports keyboard interaction, accessibility roles, focus ring management,
 * and ARIA attributes for web.
 *
 * @example
 * ```tsx
 * <Button onPress={...}>
 *   {({ pressed }) => <Text>{pressed ? 'Pressed' : 'Press Me'}</Text>}
 * </Button>
 * ```
 */export const Button = React.memo(
  React.forwardRef<View, ButtonProps>(function Button(props, forwardedRef) {
    const { children, hitSlop = DEFAULT_HIT_SLOP, style } = props;

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(forwardedRef, () => internalRef.current!);

    const {
      a11yProps,
      focused,
      focusRingStyle,
      handleAccessibilityAction,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      handlePressIn,
      handlePressOut,
      isFocusable,
      pressed,
      tabIndex,
    } = useButton(props);

    const buttonState: ButtonState = React.useMemo(
      () => ({
        focused,
        pressed,
      }),
      [focused, pressed],
    );

    const resolvedStyle = React.useMemo<StyleProp<ViewStyle>>(() => {
      const base = evaluateStyles(style, buttonState);
      return focusRingStyle ? [base, focusRingStyle] : base;
    }, [style, buttonState, focusRingStyle]);

    return (
      <PressableWithKeyDown
        {...props}
        {...a11yProps}
        focusable={isFocusable}
        hitSlop={hitSlop}
        onAccessibilityAction={handleAccessibilityAction}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        ref={internalRef}
        style={resolvedStyle}
        tabIndex={tabIndex}
      >
        {(pressableState: PressableStateCallbackType) =>
          evaluateStyles(children, {
            ...pressableState,
            focused,
          })
        }
      </PressableWithKeyDown>
    );
  }),
);

Button.displayName = 'Button';
