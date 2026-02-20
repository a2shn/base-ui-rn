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

/**
 * Default hit slop applied to the button.
 *
 * @default
 * { top: 10, bottom: 10, left: 10, right: 10 }
 */
const DEFAULT_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

type WebAccessibilityProps = {
  tabIndex?: 0 | -1;
  'aria-disabled'?: boolean;
};

type KeyPressEventData = {
  key: string;
};

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps &
      WebAccessibilityProps & {
        onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      } & React.RefAttributes<View>
  >;

/**
 * Props for `Button.Root`.
 */
export interface ButtonProps extends PressableProps {
  /**
   * Disables press, focus, and keyboard interaction.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Keeps the button focusable even when disabled.
   *
   * Useful for loading states where focus should not be lost.
   *
   * @default false
   */
  focusableWhenDisabled?: boolean;

  /**
   * Describes the result of activating the button.
   *
   * @default 'Activates the button'
   */
  accessibilityHint?: string;

  /**
   * Called when a hardware keyboard key is pressed while the button is focused.
   *
   * Useful for Web and TV platforms where keyboard interaction is expected.
   */
  onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  /**
   * Expands the interactive touch area beyond the visual bounds.
   *
   * @default
   * { top: 10, bottom: 10, left: 10, right: 10 }
   */
  hitSlop?: PressableProps['hitSlop'];
}

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

    const handleAccessibilityAction = React.useCallback(
      (event: AccessibilityActionEvent) => {
        const actionName = event.nativeEvent.actionName;
        if (
          actionName === 'activate' ||
          actionName === 'click' ||
          actionName === 'magicTap'
        ) {
          if (!isDisabled) {
            onPress?.(event as unknown as GestureResponderEvent);
          }
        }

        onAccessibilityAction?.(event);
      },
      [isDisabled, onPress, onAccessibilityAction],
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
          onPress?.(e as unknown as GestureResponderEvent);
        }

        onKeyPress?.(e);
      },
      [isDisabled, onPress, onKeyPress],
    );

    return (
      <PressableWithKeyPress
        {...props}
        ref={forwardedRef}
        disabled={isDisabled}
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
        onPress={onPress}
        onKeyPress={handleKeyPress}
      >
        {children}
      </PressableWithKeyPress>
    );
  }),
);
