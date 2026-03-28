import {
  DEFAULT_HIT_SLOP,
  evaluateStyles,
  PressableWithKeyPress,
} from '@base-ui-rn/core';
import * as React from 'react';
import { type Role, StyleProp, View, ViewStyle } from 'react-native';

import { useToggleGroupContext } from './group-context';
import { type ToggleProps } from './types';
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
  React.forwardRef<View, ToggleProps>(function Root(props, forwardedRef) {
    const {
      accessibilityHint: accessibilityHintProp,
      accessibilityRole: accessibilityRoleProp,
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpandedProp,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      hitSlop = DEFAULT_HIT_SLOP,
      role = 'checkbox',
      style,
      value,
      ...otherProps
    } = props;

    const groupContext = useToggleGroupContext();

    const {
      focused,
      focusRingStyle,
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
      tabIndex,
    } = useToggle(props, groupContext);

    const focusVisible = focusRingStyle !== null;

    if (isInGroup && value === undefined) {
      console.warn(
        'Toggle: A Toggle used within a ToggleGroup must have a "value" prop.',
      );
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

    const resolvedStyle = React.useMemo<StyleProp<ViewStyle>>(() => {
      const baseStyle = evaluateStyles(style, {
        disabled: isDisabled,
        focused,
        focusVisible,
        pressed: isPressed,
      });
      if (focusRingStyle) {
        return [baseStyle, focusRingStyle];
      }
      return baseStyle;
    }, [style, focused, focusVisible, isDisabled, focusRingStyle]);

    return (
      <PressableWithKeyPress
        {...otherProps}
        accessibilityActions={mergedAccessibilityActions}
        accessibilityHint={accessibilityHintProp}
        accessibilityState={mergedAccessibilityState}
        accessible
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-disabled={resolvedAriaDisabled}
        aria-expanded={ariaExpandedProp}
        aria-hidden={ariaHidden}
        aria-keyshortcuts={resolvedAriaKeyshortcuts}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-pressed={resolvedAriaPressed}
        data-pressed={resolvedDataPressed}
        disabled={isDisabled}
        focusable={isFocusable}
        hitSlop={hitSlop}
        importantForAccessibility='yes'
        onAccessibilityAction={handleAccessibilityAction}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onPress={handlePress}
        ref={internalRef}
        role={(accessibilityRoleProp ?? role) as Role}
        style={resolvedStyle}
        tabIndex={tabIndex}
      >
        {(pressableState) =>
          evaluateStyles(children, {
            ...pressableState,
            focused,
            focusVisible,
            pressed: isPressed,
          })
        }
      </PressableWithKeyPress>
    );
  }),
);

Toggle.displayName = 'Toggle';
