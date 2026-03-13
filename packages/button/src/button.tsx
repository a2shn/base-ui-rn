import * as React from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type NativeSyntheticEvent,
  type Role,
} from 'react-native';
import { type ButtonProps, type KeyPressEventData } from './types';
import {
  DEFAULT_HIT_SLOP,
  DEFAULT_FOCUS_RING_STYLE,
  type WebAccessibilityProps,
} from '@base-ui-rn/core';
import { useButton } from './use-button';

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps &
      WebAccessibilityProps & {
        onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      } & React.RefAttributes<View>
  >;

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
      shortcut,
      tabIndex: tabIndexProp,
      'aria-disabled': ariaDisabledProp,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherProps
    },
    forwardedRef,
  ) {
    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(forwardedRef, () => internalRef.current!);

    const {
      focused,
      focusVisible,
      handleAccessibilityAction,
      handleBlur,
      handleFocus,
      handleKeyPress,
      handlePress,
      isFocusable,
      mergedAccessibilityActions,
      mergedAccessibilityState,
      resolvedAriaDisabled,
      resolvedAriaKeyshortcuts,
      resolvedTabIndex,
    } = useButton({
      disabled,
      focusableWhenDisabled,
      focusVisible: forceFocusVisible,
      accessibilityState,
      accessibilityActions,
      onPressedChange,
      onPress,
      onAccessibilityAction,
      onKeyPress,
      onFocusProp,
      onBlurProp,
      shortcut,
      tabIndex: tabIndexProp,
      ariaDisabled: ariaDisabledProp,
    });

    return (
      <PressableWithKeyPress
        {...otherProps}
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
        aria-keyshortcuts={resolvedAriaKeyshortcuts}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
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
