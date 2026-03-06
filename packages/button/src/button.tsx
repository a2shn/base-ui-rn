import * as React from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type NativeSyntheticEvent,
  type GestureResponderEvent,
  type AccessibilityActionEvent,
  type Role,
  type TargetedEvent,
} from 'react-native';
import {
  type ButtonPressedChangeDetails,
  type ButtonProps,
  type KeyPressEventData,
  type WebAccessibilityProps,
} from './types';
import {
  DEFAULT_HIT_SLOP,
  mergeAccessibilityActions,
  isActivationAction,
  mergeAccessibilityState,
  resolveTabIndex,
  resolveAriaDisabled,
  DEFAULT_FOCUS_RING_STYLE,
  useKeyboardActivation,
} from '@base-ui-rn/core';
import { useFocus } from '@base-ui-rn/focus-ring';

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps &
      WebAccessibilityProps & {
        onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      } & React.RefAttributes<View>
  >;

/**
 * Headless button primitive built on top of React Native `Pressable`.
 *
 * Supports keyboard interaction, accessibility roles, and focus ring management.
 *
 * @example
 * ```tsx
 * <Button
 *   accessibilityHint="Submits the form"
 *   onPress={handleSubmit}
 * >
 *   {({ pressed, focusVisible }) => (
 *     <View style={{
 *       opacity: pressed ? 0.6 : 1,
 *       borderWidth: focusVisible ? 2 : 0,
 *     }}>
 *       <Text>Submit</Text>
 *     </View>
 *   )}
 * </Button>
 * ```
 */
export const Button = React.memo(
  React.forwardRef<View, ButtonProps>(function Root(
    {
      disabled,
      onPress,
      onPressedChange,
      onKeyPress,
      accessibilityHint = 'Activates the button',
      accessibilityState,
      accessibilityActions,
      onAccessibilityAction,
      accessibilityRole,
      focusableWhenDisabled = false,
      hitSlop = DEFAULT_HIT_SLOP,
      children,
      style,
      focusVisible: forceFocusVisible = false,
      disableDefaultFocusRing = false,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      ...props
    },
    forwardedRef,
  ) {
    const isDisabled = disabled === true;
    const isFocusable = !isDisabled || focusableWhenDisabled === true;

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(forwardedRef, () => internalRef.current!);

    const { focused, focusVisible, onFocus, onBlur } = useFocus({
      focusVisible: forceFocusVisible,
    });

    const mergedAccessibilityState = React.useMemo(
      () =>
        mergeAccessibilityState(
          accessibilityState as Record<string, unknown> | undefined,
          isDisabled,
        ),
      [accessibilityState, isDisabled],
    );

    const resolvedTabIndex = resolveTabIndex(
      isFocusable,
      (props as WebAccessibilityProps).tabIndex,
    );
    const resolvedAriaDisabled = resolveAriaDisabled(
      isDisabled,
      (props as WebAccessibilityProps)['aria-disabled'],
    );

    const mergedAccessibilityActions = React.useMemo(
      () => mergeAccessibilityActions(accessibilityActions),
      [accessibilityActions],
    );

    const activateButton = React.useCallback(
      (
        source: ButtonPressedChangeDetails['source'],
        nativeEvent: GestureResponderEvent | null = null,
      ) => {
        onPressedChange?.({ source });
        // For 'press' source, always call onPress
        // For other sources, only call onPress if onPressedChange is not provided
        if (source === 'press') {
          onPress?.(nativeEvent as GestureResponderEvent);
        } else if (!onPressedChange) {
          // If onPressedChange is not provided, call onPress for all sources
          onPress?.(nativeEvent as GestureResponderEvent);
        }
      },
      [onPressedChange, onPress],
    );

    const handleAccessibilityAction = React.useCallback(
      (event: AccessibilityActionEvent) => {
        const actionName = event.nativeEvent.actionName;
        if (isActivationAction(actionName) && !isDisabled) {
          activateButton('accessibilityAction');
        }

        onAccessibilityAction?.(event);
      },
      [isDisabled, activateButton, onAccessibilityAction],
    );

    const performKeyboardActivation = React.useCallback(() => {
      activateButton('keyboard');
    }, [activateButton]);

    const handleKeyboardActivation = useKeyboardActivation(
      performKeyboardActivation,
      isDisabled,
    );

    const handleKeyPress = React.useCallback(
      (e: NativeSyntheticEvent<KeyPressEventData>) => {
        handleKeyboardActivation(e);
        onKeyPress?.(e);
      },
      [handleKeyboardActivation, onKeyPress],
    );

    const handlePress = React.useCallback(
      (event: GestureResponderEvent) => {
        if (!isDisabled) {
          activateButton('press', event);
        }
      },
      [activateButton, isDisabled],
    );

    const handleFocus = React.useCallback(
      (e: NativeSyntheticEvent<TargetedEvent>) => {
        onFocus();
        onFocusProp?.(e);
      },
      [onFocus, onFocusProp],
    );

    const handleBlur = React.useCallback(
      (e: NativeSyntheticEvent<TargetedEvent>) => {
        onBlur();
        onBlurProp?.(e);
      },
      [onBlur, onBlurProp],
    );

    return (
      <PressableWithKeyPress
        {...props}
        ref={internalRef}
        accessible
        role={(accessibilityRole ?? 'button') as Role}
        accessibilityHint={accessibilityHint}
        accessibilityState={mergedAccessibilityState}
        accessibilityActions={mergedAccessibilityActions}
        onAccessibilityAction={handleAccessibilityAction}
        focusable={isFocusable}
        tabIndex={resolvedTabIndex}
        aria-disabled={resolvedAriaDisabled}
        importantForAccessibility='yes'
        hitSlop={hitSlop}
        onPress={handlePress}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={(pressableState) => {
          const state = {
            ...pressableState,
            focused,
            focusVisible,
          };
          const resolvedStyle =
            typeof style === 'function' ? style(state) : style;
          return [
            resolvedStyle,
            !disableDefaultFocusRing &&
              focusVisible &&
              DEFAULT_FOCUS_RING_STYLE,
          ];
        }}
      >
        {(pressableState) => {
          const state = {
            ...pressableState,
            focused,
            focusVisible,
          };
          return typeof children === 'function' ? children(state) : children;
        }}
      </PressableWithKeyPress>
    );
  }),
);

Button.displayName = 'Button';
