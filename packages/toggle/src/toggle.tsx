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
  DEFAULT_HIT_SLOP,
  mergeAccessibilityActions,
  isActivationAction,
  mergeAccessibilityState,
  resolveTabIndex,
  resolveAriaDisabled,
  resolveAriaPressed,
  resolveDataPressed,
  DEFAULT_FOCUS_RING_STYLE,
  type KeyPressEventData,
  type WebToggleAccessibilityProps,
  useKeyboardActivation,
} from '@base-ui-rn/core';
import { type TogglePressedChangeDetails, type ToggleProps } from './types';
import { useToggleGroupContext } from './group-context';
import { useFocus } from '@base-ui-rn/focus-ring';
import { useKeyboardShortcut } from '@base-ui-rn/keyboard-shortcuts';

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
      ...props
    },
    forwardedRef,
  ) {
    const groupContext = useToggleGroupContext();
    const isInGroup = groupContext !== null;

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
      if (isInGroup && value !== undefined) {
        // We use a ref object to store the current element for focus management
        return groupContext.registerItem(value, internalRef);
      }
      return undefined;
    }, [isInGroup, value, groupContext]);

    React.useEffect(() => {
      if (isInGroup && value !== undefined) {
        return groupContext.registerValue(value);
      }
      return undefined;
    }, [isInGroup, value, groupContext]);

    const isDisabled =
      disabled === true || (isInGroup && groupContext.disabled);
    const isFocusable = !isDisabled || focusableWhenDisabled === true;

    const { focused, focusVisible, onFocus, onBlur } = useFocus({
      focusVisible: forceFocusVisible,
    });

    const [uncontrolledState, setUncontrolledState] =
      React.useState(defaultPressed);

    let isPressed: boolean;
    if (isInGroup && value !== undefined) {
      isPressed = groupContext.valueSet.has(value);
    } else {
      isPressed =
        controlledPressed !== undefined ? controlledPressed : uncontrolledState;
    }

    const dispatchChange = React.useCallback(
      (next: boolean, details: TogglePressedChangeDetails) => {
        if (isInGroup && value !== undefined) {
          groupContext.toggleValue(value, { ...details, value });
        } else {
          if (controlledPressed === undefined) {
            setUncontrolledState(next);
          }
          onPressedChange?.(next, details);
        }
      },
      [isInGroup, value, groupContext, controlledPressed, onPressedChange],
    );

    const activateToggle = React.useCallback(
      (
        source: TogglePressedChangeDetails['source'],
        nativeEvent: GestureResponderEvent | null = null,
      ) => {
        dispatchChange(!isPressed, { source });
        if (nativeEvent !== null && source === 'press') {
          onPress?.(nativeEvent);
        }
      },
      [isPressed, dispatchChange, onPress],
    );

    const handlePress = React.useCallback(
      (event: GestureResponderEvent) => {
        activateToggle('press', event);
      },
      [activateToggle],
    );

    const performKeyboardActivation = React.useCallback(() => {
      activateToggle('keyboard');
    }, [activateToggle]);

    const handleKeyboardActivation = useKeyboardActivation(
      performKeyboardActivation,
      isDisabled,
    );

    useKeyboardShortcut(shortcut, () => {
      if (!isDisabled) {
        performKeyboardActivation();
      }
    });

    const handleKeyPress = React.useCallback(
      (e: NativeSyntheticEvent<KeyPressEventData>) => {
        handleKeyboardActivation(e);
        onKeyPress?.(e);
      },
      [handleKeyboardActivation, onKeyPress],
    );

    const handleKeyDown = React.useCallback(
      (e: NativeSyntheticEvent<KeyPressEventData>) => {
        if (isInGroup && value !== undefined) {
          groupContext.onToggleKeyPress(value, e);
        }
      },
      [isInGroup, value, groupContext],
    );

    const handleAccessibilityAction = React.useCallback(
      (event: AccessibilityActionEvent) => {
        const { actionName } = event.nativeEvent;

        if (isActivationAction(actionName)) {
          activateToggle('accessibilityAction');
        }

        onAccessibilityAction?.(event);
      },
      [activateToggle, onAccessibilityAction],
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

    const mergedAccessibilityState = React.useMemo(
      () =>
        mergeAccessibilityState(
          accessibilityState as Record<string, unknown> | undefined,
          isDisabled,
          isPressed,
        ),
      [accessibilityState, isDisabled, isPressed],
    );

    const mergedAccessibilityActions = React.useMemo(
      () => mergeAccessibilityActions(accessibilityActions),
      [accessibilityActions],
    );

    const resolvedTabIndex = resolveTabIndex(
      isFocusable,
      (props as WebToggleAccessibilityProps).tabIndex,
    );

    const resolvedAriaDisabled = resolveAriaDisabled(
      isDisabled,
      (props as WebToggleAccessibilityProps)['aria-disabled'],
    );

    const resolvedAriaPressed = resolveAriaPressed(
      isPressed,
      (props as WebToggleAccessibilityProps)['aria-pressed'],
    );

    const resolvedDataPressed = resolveDataPressed(
      isPressed,
      (props as WebToggleAccessibilityProps)['data-pressed'],
    );

    return (
      <PressableWithKeyPress
        {...props}
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
