import * as React from 'react';
import {
  Pressable,
  type PressableProps,
  type View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
  type GestureResponderEvent,
} from 'react-native';
import { Slot } from '@base-ui-rn/slot';

export interface ButtonProps extends PressableProps {
  /**
   * When true, Button.Root delegates rendering to its child via Slot.
   */
  asChild?: boolean;

  /**
   * Accessibility hint describing the result of pressing the button.
   * Required to encourage consistent accessibility descriptions.
   */
  accessibilityHint: string;
}

/**
 * Low-level button primitive.
 *
 * Behavior:
 * - Renders a native Pressable by default.
 * - When `asChild` is true, delegates rendering to its child via Slot.
 * - Normalizes disabled state across accessibility and focus props.
 * - Injects the Responder System to ensure generic children (like View)
 * becoming interactive.
 */
export const Root = React.memo(
  React.forwardRef<View, ButtonProps>(function Root(
    {
      asChild = false,
      disabled,
      onPress,
      accessibilityHint,
      children,
      ...props
    },
    forwardedRef,
  ) {
    const isDisabled = disabled === true;

    if (__DEV__ && asChild && React.isValidElement(children)) {
      const childType = (children as React.ReactElement).type;
      const isPressable = childType === Pressable;

      if (!isPressable) {
        const childName =
          typeof childType === 'string'
            ? childType
            : (childType as { displayName?: string; name?: string })
                .displayName ||
              (childType as { displayName?: string; name?: string }).name ||
              'Unknown';

        const identifier =
          props.testID || props.accessibilityLabel || accessibilityHint;

        const locationHint = identifier ? ` (Identifier: "${identifier}")` : '';

        console.warn(
          `[Base UI RN] <Button.Root asChild> was used with a non-Pressable child: <${childName}>${locationHint}.\n` +
            `While we inject touch support, generic components may not provide a full ` +
            `native keyboard focus experience. Consider using <Pressable> as the direct child.`,
        );
      }
    }

    const responderProps = React.useMemo(
      () => ({
        onStartShouldSetResponder: () => !isDisabled,
        onResponderRelease: (e: GestureResponderEvent) => {
          if (!isDisabled) {
            onPress?.(e);
          }
        },
        onTerminationRequest: () => true,
      }),
      [isDisabled, onPress],
    );

    const handleKeyPress = React.useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (isDisabled) return;

        const key = e.nativeEvent.key;
        if (key === 'Enter' || key === ' ') {
          onPress?.(e as unknown as GestureResponderEvent);
        }
      },
      [isDisabled, onPress],
    );

    const commonProps = {
      ...responderProps,
      accessible: true,
      accessibilityRole: 'button' as const,
      accessibilityHint,
      accessibilityState: { disabled: isDisabled },
      focusable: !isDisabled,
      importantForAccessibility: 'yes' as const,
      onKeyPress: handleKeyPress,
      ...props,
    };

    if (asChild) {
      return (
        <Slot ref={forwardedRef} {...commonProps} onPress={onPress}>
          {children as React.ReactElement}
        </Slot>
      );
    }

    return (
      <Pressable
        ref={forwardedRef}
        disabled={isDisabled}
        {...commonProps}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }),
);

Root.displayName = 'Button.Root';
