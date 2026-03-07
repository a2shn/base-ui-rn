import * as React from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type NativeSyntheticEvent,
  type Role,
} from 'react-native';
import {
  DEFAULT_HIT_SLOP,
  DEFAULT_FOCUS_RING_STYLE,
  type KeyPressEventData,
  type WebToggleAccessibilityProps,
} from '@base-ui-rn/core';
import { type ToggleProps } from './types';
import { useToggleGroupContext } from './group-context';
import { useToggle } from './use-toggle';

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps &
      WebToggleAccessibilityProps & {
        onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
        onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      } & React.RefAttributes<View>
  >;

/**
 * Headless toggle primitive built on top of React Native `Pressable`.
 *
 * Supports keyboard interaction, accessibility roles, and focus ring management.
 * Can be used independently or as part of a `ToggleGroup`.
 *
 * @example
 * ```tsx
 * <Toggle
 *   role="checkbox"
 *   accessibilityHint="Enables dark mode"
 *   onPressedChange={(pressed) => console.log('Dark mode:', pressed)}
 * >
 *   {({ pressed, focusVisible }) => (
 *     <View style={{
 *       backgroundColor: pressed ? '#000' : '#fff',
 *       opacity: focusVisible ? 0.8 : 1
 *     }}>
 *       <Text style={{ color: pressed ? '#fff' : '#000' }}>Dark Mode</Text>
 *     </View>
 *   )}
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
      onKeyPress,
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
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      shortcut,
      tabIndex: tabIndexProp,
      'aria-disabled': ariaDisabledProp,
      'aria-pressed': ariaPressedProp,
      'data-pressed': dataPressedProp,
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
      handleKeyPress,
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
      onKeyPress,
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
        aria-disabled={resolvedAriaDisabled}
        aria-keyshortcuts={resolvedAriaKeyshortcuts}
        aria-pressed={resolvedAriaPressed}
        data-pressed={resolvedDataPressed}
        importantForAccessibility='yes'
        hitSlop={hitSlop}
        onPress={handlePress}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={(pressableState) => {
          const state = {
            ...pressableState,
            pressed: isPressed,
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
            pressed: isPressed,
            focused,
            focusVisible,
          };
          return typeof children === 'function' ? children(state) : children;
        }}
      </PressableWithKeyPress>
    );
  }),
);

Toggle.displayName = 'Toggle';
