import * as React from 'react';
import {
  Pressable,
  type PressableProps,
  type View,
  type NativeSyntheticEvent,
  type GestureResponderEvent,
  type AccessibilityActionEvent,
} from 'react-native';
import {
  DEFAULT_HIT_SLOP,
  isActivationKey,
  mergeAccessibilityActions,
  isActivationAction,
  mergeAccessibilityState,
  resolveTabIndex,
  resolveAriaDisabled,
  resolveAriaPressed,
  resolveDataPressed,
  type KeyPressEventData,
  type WebToggleAccessibilityProps,
  type PressedChangeDetails,
} from '@base-ui-rn/core';
import { type TogglePressedChangeDetails, type ToggleProps } from './types';

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps &
      WebToggleAccessibilityProps & {
        onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      } & React.RefAttributes<View>
  >;

/**
 * Headless toggle primitive built on top of React Native `Pressable`.
 *
 * Supports a primary `pressed` / `onPressedChange` API.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Toggle
 *   defaultPressed={false}
 *   onPressedChange={(pressed, { source }) => console.log(pressed, source)}
 *   accessibilityHint="Enables dark mode"
 * >
 *   {({ pressed }) => <View style={{ opacity: pressed ? 0.6 : 1 }} />}
 * </Toggle>
 *
 * // Controlled
 * <Toggle
 *   pressed={enabled}
 *   onPressedChange={({ pressed }) => setEnabled(pressed)}
 *   accessibilityHint="Enables dark mode"
 * >
 *   <Text>Toggle</Text>
 * </Toggle>
 * ```
 */
export const Toggle = React.memo(
  React.forwardRef<View, ToggleProps>(function Root(
    {
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
      ...props
    },
    forwardedRef,
  ) {
    const isDisabled = disabled === true;
    const isFocusable = !isDisabled || focusableWhenDisabled === true;

    const controlledState = controlledPressed;

    const [uncontrolledState, setUncontrolledState] =
      React.useState(defaultPressed);

    const isPressed =
      controlledState !== undefined ? controlledState : uncontrolledState;

    // Fires both the new and legacy callbacks so consumers can use either.

    const dispatchChange = React.useCallback(
      (next: boolean, details: TogglePressedChangeDetails) => {
        if (controlledState === undefined) {
          setUncontrolledState(next);
        }
        onPressedChange?.(next, details);
      },
      [controlledState, onPressedChange],
    );

    const activateToggle = React.useCallback(
      (
        source: PressedChangeDetails['source'],
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

    const handleKeyPress = React.useCallback(
      (e: NativeSyntheticEvent<KeyPressEventData>) => {
        const key = e.nativeEvent.key;

        if (isActivationKey(key)) {
          activateToggle('keyboard');
        }

        onKeyPress?.(e);
      },
      [activateToggle, onKeyPress],
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

    // aria-pressed is relevant when the consumer overrides role to 'button'.
    // For checkbox / switch roles, accessibilityState.checked maps to aria-checked.
    const resolvedAriaPressed = resolveAriaPressed(
      isPressed,
      (props as WebToggleAccessibilityProps)['aria-pressed'],
    );

    // data-pressed enables CSS selectors such as [data-pressed="true"] { … }
    const resolvedDataPressed = resolveDataPressed(
      isPressed,
      (props as WebToggleAccessibilityProps)['data-pressed'],
    );

    return (
      <PressableWithKeyPress
        {...props}
        ref={forwardedRef}
        disabled={isDisabled}
        accessible
        accessibilityRole={accessibilityRole ?? role}
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
      >
        {children}
      </PressableWithKeyPress>
    );
  }),
);
