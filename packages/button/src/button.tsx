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
 * Default hit slop applied to the button.
 *
 * @default
 * { top: 10, bottom: 10, left: 10, right: 10 }
 */
const DEFAULT_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

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
   * Describes the result of activating the button.
   *
   * This is required for accessibility.
   */
  accessibilityHint: string;

  /**
   * Called when a hardware keyboard key is pressed while the button is focused.
   *
   * Useful for Web and TV platforms where keyboard interaction is expected.
   */
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;

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
      accessibilityHint,
      hitSlop = DEFAULT_HIT_SLOP,
      children,
      ...props
    },
    forwardedRef,
  ) {
    const isDisabled = disabled === true;

    const handleKeyPress = React.useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (isDisabled) return;

        const key = e.nativeEvent.key;
        if (key === 'Enter' || key === ' ') {
          onPress?.(e as unknown as GestureResponderEvent);
        }

        props.onKeyPress?.(e);
      },
      [isDisabled, onPress, props],
    );

    return (
      <Pressable
        ref={forwardedRef}
        disabled={isDisabled}
        accessible
        accessibilityRole='button'
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled }}
        focusable={!isDisabled}
        importantForAccessibility='yes'
        hitSlop={hitSlop}
        onPress={onPress}
        onKeyPress={handleKeyPress}
        {...props}
      >
        {children}
      </Pressable>
    );
  }),
);
