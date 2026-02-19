import * as React from 'react';
import {
  Pressable,
  type PressableProps,
  type View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
  type GestureResponderEvent,
} from 'react-native';

/**
 * Default hit slop applied to the toggle.
 *
 * @default
 * { top: 14, bottom: 14, left: 14, right: 14 }
 */
const DEFAULT_HIT_SLOP = { top: 14, bottom: 14, left: 14, right: 14 };

/**
 * Props for `Toggle.Root`.
 */
export interface ToggleProps extends Omit<PressableProps, 'role'> {
  /**
   * Controlled checked state.
   */
  checked?: boolean;

  /**
   * Uncontrolled initial checked state.
   *
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Called when the checked state changes.
   *
   * @param checked The next checked state.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Accessibility role used by screen readers.
   *
   * @default 'checkbox'
   */
  role?: 'checkbox' | 'switch';

  /**
   * Describes the result of toggling the control.
   */
  accessibilityHint: string;

  /**
   * Called when a hardware keyboard key is pressed.
   */
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;

  /**
   * Expands the interactive touch area.
   *
   * @default
   * { top: 14, bottom: 14, left: 14, right: 14 }
   */
  hitSlop?: PressableProps['hitSlop'];
}

/**
 * Headless toggle primitive built on top of React Native `Pressable`.
 *
 * @param checked
 * Controlled checked state.
 *
 * @param defaultChecked
 * Initial unchecked state when uncontrolled.
 *
 * @param onCheckedChange
 * Callback fired when the checked state changes.
 *
 * @param role
 * Accessibility role exposed to assistive technologies.
 *
 * @param accessibilityHint
 * Describes the result of toggling the control.
 *
 * @param hitSlop
 * Expands the interactive touch area.
 *
 * @default role 'checkbox'
 * @default hitSlop { top: 14, bottom: 14, left: 14, right: 14 }
 *
 * @example
 * ```tsx
 * <Toggle.Root
 *   accessibilityHint="Enables notifications"
 *   onCheckedChange={setEnabled}
 * >
 *   {({ pressed }) => (
 *     <View style={{ opacity: pressed ? 0.6 : 1 }} />
 *   )}
 * </Toggle.Root>
 * ```
 */
export const Toggle = React.memo(
  React.forwardRef<View, ToggleProps>(function Root(
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      role = 'checkbox',
      disabled,
      onPress,
      accessibilityHint,
      accessibilityState,
      hitSlop = DEFAULT_HIT_SLOP,
      children,
      ...props
    },
    forwardedRef,
  ) {
    const isDisabled = disabled === true;

    const [uncontrolledChecked, setUncontrolledChecked] =
      React.useState(defaultChecked);

    const isChecked = checked !== undefined ? checked : uncontrolledChecked;

    const handleToggle = React.useCallback(
      (event: GestureResponderEvent) => {
        if (isDisabled) return;

        const nextChecked = !isChecked;

        if (checked === undefined) {
          setUncontrolledChecked(nextChecked);
        }

        onCheckedChange?.(nextChecked);
        onPress?.(event);
      },
      [isDisabled, isChecked, checked, onCheckedChange, onPress],
    );

    const handleKeyPress = React.useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (isDisabled) return;

        const key = e.nativeEvent.key;
        if (key === 'Enter' || key === ' ') {
          handleToggle(e as unknown as GestureResponderEvent);
        }

        props.onKeyPress?.(e);
      },
      [isDisabled, handleToggle, props],
    );

    const mergedAccessibilityState = React.useMemo(
      () => ({
        ...accessibilityState,
        disabled: isDisabled,
        checked: isChecked,
      }),
      [accessibilityState, isDisabled, isChecked],
    );

    return (
      <Pressable
        ref={forwardedRef}
        disabled={isDisabled}
        accessible
        accessibilityRole={role}
        accessibilityHint={accessibilityHint}
        accessibilityState={mergedAccessibilityState}
        focusable={!isDisabled}
        importantForAccessibility='yes'
        hitSlop={hitSlop}
        onPress={handleToggle}
        onKeyPress={handleKeyPress}
        {...props}
      >
        {children}
      </Pressable>
    );
  }),
);
