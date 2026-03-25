import {
  DEFAULT_HIT_SLOP,
  evaluateStyles,
  PressableWithKeyPress,
} from '@base-ui-rn/core';
import * as React from 'react';
import { type Role, StyleProp, View, ViewStyle } from 'react-native';

import { type ButtonProps } from './types';
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
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      disableDefaultFocusRing,
      hitSlop = DEFAULT_HIT_SLOP,
      style,
      ...otherProps
    } = props;

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(forwardedRef, () => internalRef.current!);

    const {
      focused,
      focusRingStyle,
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

    const resolvedStyle = React.useMemo<StyleProp<ViewStyle>>(() => {
      const baseStyle = evaluateStyles(style, {
        focused,
        focusVisible,
        pressed: false,
      });
      if (focusRingStyle) {
        return [baseStyle, focusRingStyle];
      }
      return baseStyle;
    }, [style, focused, focusVisible, focusRingStyle]);

    return (
      <PressableWithKeyPress
        {...otherProps}
        accessibilityActions={mergedAccessibilityActions}
        accessibilityHint={accessibilityHint}
        accessibilityState={mergedAccessibilityState}
        accessible
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-disabled={resolvedAriaDisabled}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden}
        aria-keyshortcuts={resolvedAriaKeyshortcuts}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        focusable={isFocusable}
        hitSlop={hitSlop}
        importantForAccessibility='yes'
        onAccessibilityAction={handleAccessibilityAction}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onPress={handlePress}
        ref={internalRef}
        role={(accessibilityRole ?? 'button') as Role}
        style={resolvedStyle}
        tabIndex={resolvedTabIndex}
      >
        {(pressableState) =>
          evaluateStyles(children, { ...pressableState, focused, focusVisible })
        }
      </PressableWithKeyPress>
    );
  }),
);

Button.displayName = 'Button';
