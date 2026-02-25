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
} from '@base-ui-rn/core';
import { type TogglePressedChangeDetails, type ToggleProps } from './types';
import { useToggleGroupContext } from './group-context';

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
 * @param value
 * The value of the toggle, used when it is part of a `ToggleGroup`.
 *
 * @param pressed
 * Controlled pressed state.
 *
 * @param defaultPressed
 * Uncontrolled initial pressed state.
 *
 * @param onPressedChange
 * Called when the pressed state changes.
 *
 * @param role
 * Accessibility role exposed to assistive technologies.
 *
 * @param disabled
 * Whether the toggle should ignore user interaction.
 *
 * @param hitSlop
 * Expands the interactive touch area beyond the visual bounds.
 *
 * @default role 'checkbox'
 * @default defaultPressed false
 * @default hitSlop { top: 14, bottom: 14, left: 14, right: 14 }
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
 *   onPressedChange={(pressed) => setEnabled(pressed)}
 *   accessibilityHint="Enables dark mode"
 * >
 *   <Text>Toggle</Text>
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

    React.useEffect(() => {
      if (isInGroup && value !== undefined) {
        return groupContext.registerValue(value);
      }
      return undefined;
    }, [isInGroup, value, groupContext]);

    const isDisabled =
      disabled === true || (isInGroup && groupContext.disabled);
    const isFocusable = !isDisabled || focusableWhenDisabled === true;

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

    const resolvedAriaPressed = resolveAriaPressed(
      isPressed,
      (props as WebToggleAccessibilityProps)['aria-pressed'],
    );

    const resolvedDataPressed = resolveDataPressed(
      isPressed,
      (props as WebToggleAccessibilityProps)['data-pressed'],
    );

    const resolvedChildren =
      typeof children === 'function'
        ? children({ pressed: isPressed })
        : children;

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
        {resolvedChildren}
      </PressableWithKeyPress>
    );
  }),
);
