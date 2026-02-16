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

/**
 * Recommended minimum touch target size is 44-48dp.
 * We apply a default slop of 10 to help smaller visual elements meet this requirement
 * without affecting the layout flow.
 */
const DEFAULT_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

export interface ToggleRootProps extends Omit<PressableProps, 'role'> {
  /**
   * The controlled state of the toggle.
   */
  checked?: boolean;

  /**
   * The uncontrolled default state of the toggle.
   */
  defaultChecked?: boolean;

  /**
   * Callback fired when the state of the toggle changes.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * When true, Toggle.Root delegates rendering to its child via Slot.
   */
  asChild?: boolean;

  /**
   * Defines whether the component acts as a checkbox or a switch for screen readers.
   * @default 'checkbox'
   */
  role?: 'checkbox' | 'switch';

  /**
   * Accessibility hint describing the result of toggling the component.
   * Required to encourage consistent accessibility descriptions.
   */
  accessibilityHint: string;
}

/**
 * Low-level toggle primitive.
 *
 * Behavior:
 * - Manages controlled and uncontrolled checked state.
 * - Renders a native Pressable by default.
 * - When `asChild` is true, delegates rendering to its child via Slot.
 * - Automatically syncs `checked` state to the native `accessibilityState`.
 * - Injects the Responder System for generic slotted children.
 * - Applies a default hitSlop of 14 to ensure touch target compliance.
 */
export const Root = React.memo(
  React.forwardRef<View, ToggleRootProps>(function Root(
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      asChild = false,
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
          `[Base UI RN] <Toggle.Root asChild> was used with a non-Pressable child: <${childName}>${locationHint}.\n` +
            `While we inject touch support, generic components may not provide a full ` +
            `native keyboard focus experience. Consider using <Pressable> as the direct child.`,
        );
      }
    }

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

    const responderProps = React.useMemo(
      () => ({
        onStartShouldSetResponder: () => !isDisabled,
        onResponderRelease: handleToggle,
        onTerminationRequest: () => true,
      }),
      [isDisabled, handleToggle],
    );

    const handleKeyPress = React.useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (isDisabled) return;

        const key = e.nativeEvent.key;
        if (key === 'Enter' || key === ' ') {
          handleToggle(e as unknown as GestureResponderEvent);
        }
      },
      [isDisabled, handleToggle],
    );

    const mergedAccessibilityState = React.useMemo(
      () => ({
        ...accessibilityState,
        disabled: isDisabled,
        checked: isChecked,
      }),
      [accessibilityState, isDisabled, isChecked],
    );

    const commonProps = {
      ...responderProps,
      accessible: true,
      accessibilityRole: role,
      accessibilityHint,
      accessibilityState: mergedAccessibilityState,
      focusable: !isDisabled,
      importantForAccessibility: 'yes' as const,
      onKeyPress: handleKeyPress,
      hitSlop,
      ...props,
    };

    if (asChild) {
      return (
        <Slot ref={forwardedRef} {...commonProps} onPress={handleToggle}>
          {children as React.ReactElement}
        </Slot>
      );
    }

    return (
      <Pressable
        ref={forwardedRef}
        disabled={isDisabled}
        {...commonProps}
        onPress={handleToggle}
      >
        {children}
      </Pressable>
    );
  }),
);

Root.displayName = 'Toggle.Root';
