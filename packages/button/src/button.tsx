import * as React from 'react';
import { Pressable, type PressableProps, type View } from 'react-native';
import { Slot } from '@base-ui-rn/slot';

/**
 * Props for the Button Root component.
 *
 * Extends React Native's PressableProps and adds support for rendering
 * as a child component via Slot.
 */
export interface ButtonProps extends PressableProps {
  /**
   * When true, Button.Root will not render a Pressable.
   * Instead, it will pass all button props and accessibility attributes
   * to its single child via Slot.
   *
   * The child must be a single valid React element.
   */
  asChild?: boolean;

  /**
   * Accessibility hint describing the result of pressing the button.
   *
   * This value is required to encourage consistent, explicit accessibility
   * descriptions across the app.
   */
  accessibilityHint: string;
}

/**
 * This component is exported as `Button.Root` and is intended to be used
 * as a low-level button primitive.
 *
 * @example
 * ```tsx
 * import { Button } from '@/components/button';
 *
 * <Button.Root accessibilityHint="Submits the form">
 *   Submit
 * </Button.Root>
 * ```
 *
 * @example
 * ```tsx
 * <Button.Root asChild accessibilityHint="Navigates to settings">
 *   <Link href="/settings">Settings</Link>
 * </Button.Root>
 * ```
 *
 * Behavior:
 * - Renders a native Pressable by default.
 * - When `asChild` is true, delegates rendering to its child via Slot.
 * - Normalizes disabled state across accessibility and focus props.
 * - Always applies button roles and accessibility attributes.
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

    // Convert onPress into the Native Responder System
    const responderProps = React.useMemo(
      () => ({
        onStartShouldSetResponder: () => !isDisabled,
        onResponderRelease: (e: any) => {
          if (!isDisabled) {
            onPress?.(e);
          }
        },
        // Ensures the view can capture the touch even if children are present
        onTerminationRequest: () => true,
      }),
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
      ...props,
    };

    if (asChild) {
      return (
        <Slot ref={forwardedRef} {...commonProps}>
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
