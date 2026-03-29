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

/**
 * A headless, accessible button primitive that manages interaction states and
 * keyboard-based activation for React Native.
 * * @remarks
 * - Implements WAI-ARIA inspired patterns for mobile (TalkBack/VoiceOver).
 * - Synchronizes internal `Pressable` state with `useButtonA11y`.
 * - Supports render-prop patterns for both `style` and `children`.
 * * @param props - Component props defined in {@link ButtonProps}.
 */
export const Button = React.memo(
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
