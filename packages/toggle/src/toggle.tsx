import * as React from 'react';
import { View, type Role } from 'react-native';
import {
  DEFAULT_HIT_SLOP,
  evaluateStyles,
  PressableWithKeyPress,
} from '@base-ui-rn/core';
import { type ToggleProps } from './types';
import { useToggleGroupContext } from './group-context';
import { useToggle } from './use-toggle';

/**
 * Headless toggle primitive built on top of React Native Pressable.
 *
 * A two-state button that can be pressed or not pressed. Supports keyboard
 * interaction, focus behavior, and ARIA attributes for web.
 *
 * @example
 * ```tsx
 * <Toggle>
 *   {({ pressed }) => <Text>{pressed ? 'ON' : 'OFF'}</Text>}
 * </Toggle>
 * ```
 */
export const Toggle = React.memo(
  React.forwardRef<View, ToggleProps>(function Root(
    {
      value,
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      role = 'checkbox',
      disabled,
      onPress,
      onKeyDown,
      accessibilityHint = 'Toggles the value',
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
      focusRingStyle,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      shortcut,
      tabIndex: tabIndexProp,
      'aria-label': ariaLabel,
      'aria-disabled': ariaDisabledProp,
      'aria-pressed': ariaPressedProp,
      'data-pressed': dataPressedProp,
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
    const groupContext = useToggleGroupContext();

    const {
      focused,
      focusVisible,
      handleAccessibilityAction,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      isDisabled,
      isFocusable,
      isInGroup,
      isPressed,
      mergedAccessibilityActions,
      mergedAccessibilityState,
      resolvedAriaDisabled,
      resolvedAriaKeyshortcuts,
      resolvedAriaPressed,
      resolvedDataPressed,
      resolvedTabIndex,
    } = useToggle({
      value,
      controlledPressed,
      defaultPressed,
      onPressedChange,
      disabled,
      onPress,
      onKeyDown,
      accessibilityState,
      accessibilityActions,
      onAccessibilityAction,
      focusableWhenDisabled,
      forceFocusVisible,
      onFocusProp,
      onBlurProp,
      shortcut,
      tabIndexProp,
      ariaDisabledProp,
      ariaPressedProp,
      dataPressedProp,
      groupContext,
    });

    if (process.env.NODE_ENV !== 'production') {
      if (isInGroup && value === undefined) {
        console.warn(
          'Toggle: A Toggle used within a ToggleGroup must have a "value" prop.',
        );
      }
    }

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(forwardedRef, () => internalRef.current!);

    React.useEffect(() => {
      if (groupContext && value !== undefined) {
        return groupContext.registerItem(value, internalRef);
      }
      return undefined;
    }, [value, groupContext]);

    React.useEffect(() => {
      if (groupContext && value !== undefined) {
        return groupContext.registerValue(value);
      }
      return undefined;
    }, [value, groupContext]);

    return (
      <PressableWithKeyPress
        {...otherProps}
        ref={internalRef}
        disabled={isDisabled}
        accessible
        role={(accessibilityRole ?? role) as Role}
        accessibilityHint={accessibilityHint}
        accessibilityState={mergedAccessibilityState}
        accessibilityActions={mergedAccessibilityActions}
        onAccessibilityAction={handleAccessibilityAction}
        focusable={isFocusable}
        tabIndex={resolvedTabIndex}
        aria-label={ariaLabel}
        aria-disabled={resolvedAriaDisabled}
        aria-keyshortcuts={resolvedAriaKeyshortcuts}
        aria-pressed={resolvedAriaPressed}
        data-pressed={resolvedDataPressed}
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
            { ...pressableState, pressed: isPressed, focused, focusVisible },
            { disableDefaultFocusRing, focusRingStyle },
          )
        }
      >
        {(pressableState) =>
          evaluateStyles(children, {
            ...pressableState,
            pressed: isPressed,
            focused,
            focusVisible,
          })
        }
      </PressableWithKeyPress>
    );
  }),
);

Toggle.displayName = 'Toggle';
