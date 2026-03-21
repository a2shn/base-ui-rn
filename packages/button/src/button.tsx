import * as React from 'react';
import { View, type Role } from 'react-native';
import { type ButtonProps } from './types';
import {
  DEFAULT_HIT_SLOP,
  evaluateStyles,
  PressableWithKeyPress,
} from '@base-ui-rn/core';
import { useButton } from './use-button';

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
  React.forwardRef<View, ButtonProps>(function Root(props, forwardedRef) {
    const {
      accessibilityHint = 'Activates the button',
      accessibilityRole,
      hitSlop = DEFAULT_HIT_SLOP,
      children,
      style,
      disableDefaultFocusRing = false,
      focusRingStyle,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherProps
    } = props;

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(forwardedRef, () => internalRef.current!);

    const {
      focused,
      focusVisible,
      handleAccessibilityAction,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      isFocusable,
      mergedAccessibilityActions,
      mergedAccessibilityState,
      resolvedAriaDisabled,
      resolvedAriaKeyshortcuts,
      resolvedTabIndex,
    } = useButton(props);

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
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
        importantForAccessibility='yes'
        hitSlop={hitSlop}
        onPress={handlePress}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={(pressableState) =>
          evaluateStyles(
            style,
            { ...pressableState, focused, focusVisible },
            { disableDefaultFocusRing, focusRingStyle },
          )
        }
      >
        {(pressableState) =>
          evaluateStyles(children, { ...pressableState, focused, focusVisible })
        }
      </PressableWithKeyPress>
    );
  }),
);

Button.displayName = 'Button';
