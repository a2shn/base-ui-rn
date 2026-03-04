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
    const resolvedRef = forwardedRef || internalRef;

    React.useEffect(() => {
      if (isInGroup && value !== undefined) {
        // We use a ref object to store the current element for focus management
        return groupContext.registerItem(
          value,
          resolvedRef as React.RefObject<unknown>,
        );
      }
      return undefined;
    }, [isInGroup, value, groupContext, resolvedRef]);

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

        if (isInGroup && value !== undefined) {
          groupContext.onToggleKeyPress(value, e);
        }

        onKeyPress?.(e);
      },
      [activateToggle, onKeyPress, isInGroup, value, groupContext],
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

    const resolvedStyle =
      typeof style === 'function' ? style({ pressed: isPressed }) : style;

    const resolvedChildren =
      typeof children === 'function'
        ? children({ pressed: isPressed })
        : children;

    return (
      <PressableWithKeyPress
        {...props}
        ref={resolvedRef}
        style={resolvedStyle}
        disabled={isDisabled}
        accessible
        role={accessibilityRole ?? role}
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

Toggle.displayName = 'Toggle';
