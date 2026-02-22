import * as React from 'react';
import {
  Pressable,
  type PressableProps,
  type View,
  type NativeSyntheticEvent,
  type GestureResponderEvent,
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
} from 'react-native';
import {
  type ButtonPressedChangeDetails,
  type ButtonProps,
  type KeyPressEventData,
  type WebAccessibilityProps,
} from './types';

/**
 * Default hit slop applied to the button.
 *
 * @default
 * { top: 10, bottom: 10, left: 10, right: 10 }
 */
const DEFAULT_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps &
      WebAccessibilityProps & {
        onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      } & React.RefAttributes<View>
  >;

/**
 * Headless button primitive built on top of React Native `Pressable`.
 *
 * @param disabled
 * Controls whether the button can be pressed or focused.
 *
 * @param onPress
 * Callback fired when the button is activated.
 *
 * @param accessibilityHint
 * Describes the result of activating the button.
 *
 * @param hitSlop
 * Expands the interactive touch area.
 *
 * @default hitSlop { top: 10, bottom: 10, left: 10, right: 10 }
 *
 * @example
 * ```tsx
 * <Button.Root
 *   accessibilityHint="Submits the form"
 *   onPress={handleSubmit}
 * >
 *   {({ pressed }) => (
 *     <Text style={{ opacity: pressed ? 0.6 : 1 }}>
 *       Submit
 *     </Text>
 *   )}
 * </Button.Root>
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
      ...props
    },
    forwardedRef,
  ) {
    const isDisabled = disabled === true;
    const isFocusable = !isDisabled || focusableWhenDisabled === true;

    const mergedAccessibilityState = React.useMemo(
      () => ({
        ...accessibilityState,
        disabled: isDisabled,
      }),
      [accessibilityState, isDisabled],
    );

    const resolvedTabIndex =
      (props as WebAccessibilityProps).tabIndex ?? (isFocusable ? 0 : -1);
    const resolvedAriaDisabled =
      (props as WebAccessibilityProps)['aria-disabled'] ?? isDisabled;

    const mergedAccessibilityActions = React.useMemo<
      ReadonlyArray<AccessibilityActionInfo>
    >(() => {
      const actions = accessibilityActions ?? [];
      const hasActivate = actions.some((action) => action.name === 'activate');

      return hasActivate ? actions : [...actions, { name: 'activate' }];
    }, [accessibilityActions]);

    const activateButton = React.useCallback(
      (
        source: ButtonPressedChangeDetails['source'],
        nativeEvent: GestureResponderEvent | null = null,
      ) => {
        onPressedChange?.({ source });
        // For 'press' source, always call onPress
        // For other sources, only call onPress if onPressedChange is not provided
        if (source === 'press') {
          onPress?.(nativeEvent as any);
        } else if (!onPressedChange) {
          // If onPressedChange is not provided, call onPress for all sources
          onPress?.(nativeEvent as any);
        }
      },
      [onPressedChange, onPress],
    );

    const handleAccessibilityAction = React.useCallback(
      (event: AccessibilityActionEvent) => {
        const actionName = event.nativeEvent.actionName;
        if (
          actionName === 'activate' ||
          actionName === 'click' ||
          actionName === 'magicTap'
        ) {
          if (!isDisabled) {
            activateButton('accessibilityAction');
          }
        }

        onAccessibilityAction?.(event);
      },
      [isDisabled, activateButton, onAccessibilityAction],
    );

    const handleKeyPress = React.useCallback(
      (e: NativeSyntheticEvent<KeyPressEventData>) => {
        const key = e.nativeEvent.key;
        const shouldActivate =
          key === 'Enter' ||
          key === ' ' ||
          key === 'Spacebar' ||
          key === 'Space' ||
          key === 'Select' ||
          key === 'Return' ||
          key === 'OK' ||
          key === 'Accept';

        if (shouldActivate && !isDisabled) {
          activateButton('keyboard');
        }

        onKeyPress?.(e);
      },
      [isDisabled, activateButton, onKeyPress],
    );

    const handlePress = React.useCallback(
      (event: GestureResponderEvent) => {
        if (!isDisabled) {
          activateButton('press', event);
        }
      },
      [activateButton, isDisabled],
    );

    return (
      <PressableWithKeyPress
        {...props}
        ref={forwardedRef}
        accessible
        accessibilityRole={accessibilityRole ?? 'button'}
        accessibilityHint={accessibilityHint}
        accessibilityState={mergedAccessibilityState}
        accessibilityActions={mergedAccessibilityActions}
        onAccessibilityAction={handleAccessibilityAction}
        focusable={isFocusable}
        tabIndex={resolvedTabIndex}
        aria-disabled={resolvedAriaDisabled}
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
